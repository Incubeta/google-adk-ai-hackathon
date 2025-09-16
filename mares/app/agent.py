# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
import json
from typing import Dict, Any, AsyncGenerator
import google.auth
from google.adk.agents import LlmAgent, SequentialAgent, BaseAgent
from google.adk.agents.invocation_context import InvocationContext
from google.adk.events import Event, EventActions

_, project_id = google.auth.default()
os.environ.setdefault("GOOGLE_CLOUD_PROJECT", project_id)
os.environ.setdefault("GOOGLE_CLOUD_LOCATION", "global")
os.environ.setdefault("GOOGLE_GENAI_USE_VERTEXAI", "True")


class AnalystValidationAgent(BaseAgent):
    """
    Custom agent that checks if the analyst's output indicates completion
    and processes the validation result.
    """

    def __init__(self):
        super().__init__(
            name="AnalystValidator",
            description="Validates analyst output and determines if brief is complete"
        )

    async def _run_async_impl(self, ctx: InvocationContext) -> AsyncGenerator[Event, None]:
        """Check if analyst marked the brief as complete."""
        # Get the analyst's response from state
        analyst_response = ctx.session.state.get("analyst_output", "{}")

        try:
            response_data = json.loads(analyst_response)
            status = response_data.get("status", "ERROR")

            if status == "COMPLETE":
                # Save the validated brief to state
                validated_brief = response_data.get("validated_brief", "")
                ctx.session.state["validated_brief"] = validated_brief
                ctx.session.state["analysis_complete"] = True

                # Escalate to exit the loop
                yield Event(
                    author=self.name,
                    content=f"✅ Brief validation complete",
                    actions=EventActions(escalate=True)
                )
            elif status == "INCOMPLETE":
                # Extract questions and save to state for user interaction
                questions = response_data.get("questions", [])
                ctx.session.state["pending_questions"] = questions
                ctx.session.state["analysis_complete"] = False

                yield Event(
                    author=self.name,
                    content=f"❗ Additional information needed: {
                        len(questions)} questions"
                )
            else:
                yield Event(
                    author=self.name,
                    content=f"❌ Error in analyst response: {
                        response_data.get('error', 'Unknown error')}"
                )
        except json.JSONDecodeError as e:
            yield Event(
                author=self.name,
                content=f"❌ Failed to parse analyst response: {str(e)}"
            )


# Define the three main agents using LlmAgent
def create_analyst_agent():
    """Create the Business Analyst agent."""
    instruction = """You are an expert, skeptical Senior Business Analyst with 15+ years of experience 
    in requirements gathering and validation. Your role is to ensure project briefs are 
    complete and unambiguous before they proceed to development.
    
    You task is to look through the supplied brief by the user and validate if it meets all the criteria as stated 
    
    <DEFINITION OF READY CHECKLIST>
    1. Goal & Metrics: Clear business objectives and measurable success criteria
    2. Users/Actors: Well-defined user roles and stakeholders
    3. Scope: Clear boundaries of what's included and excluded
    4. Functional Requirements: Detailed features and capabilities
    5. Data Requirements: Data sources, formats, and storage needs
    6. Non-Functional Requirements:
       - Security: Authentication, authorization, data protection
       - Performance: Response times, throughput, scalability
       - Usability: User experience requirements
       - Compliance: Regulatory or policy requirements
    </DEFINITION OF READY CHECKLIST>
    
    TASK:
    Analyze the provided project brief against the Definition of Ready checklist.
    The brief is in {project_brief} 
    
    If the brief is INCOMPLETE:
    - Identify specific gaps and ambiguities
    - Generate targeted clarifying questions (3-7 questions)
    - Focus on critical missing information
    
    If the brief is COMPLETE:
    - Confirm all checklist items are addressed
    - Provide a validated summary of the requirements
    
    OUTPUT FORMAT (STRICT JSON):
    You MUST respond with one of these two JSON structures:
    
    For incomplete briefs:
    {"status": "INCOMPLETE", "questions": ["Question 1?", "Question 2?", ...]}
    
    For complete briefs:
    {"status": "COMPLETE", "validated_brief": "A comprehensive summary of all validated requirements..."}
    
    Respond ONLY with valid JSON. No additional text or explanation outside the JSON structure."""

    return LlmAgent(
        name="BusinessAnalyst",
        model="gemini-2.0-flash",
        instruction=instruction,
        description="Analyzes project briefs and identifies ambiguities",
        output_key="analyst_output"  # Saves output to state['analyst_output']
    )


def create_scripter_agent():
    """Create the Product Owner/Scripter agent."""
    instruction = """You are an expert Agile Product Owner with extensive experience in 
    decomposing business requirements into actionable development artifacts.
    
    TASK:
    Take the validated requirements brief from {validated_brief} and generate comprehensive 
    development artifacts that will guide the implementation team.
    
    OUTPUT FORMAT:
    Generate clean Markdown output with the following sections:
    
    ## Actors
    List all user roles and system actors identified in the requirements.
    
    ## Use Cases
    For each actor, define their high-level goals and interactions with the system.
    
    ## User Stories
    Create detailed user stories following this format:
    **As a** [ROLE], **I want** [ACTION], **so that** [BENEFIT]
    
    Number each story (e.g., US-001, US-002) for easy reference.
    
    ## Acceptance Criteria
    For each user story, write acceptance criteria in Gherkin syntax:
    
    **GIVEN** [initial context]
    **WHEN** [action or event]
    **THEN** [expected outcome]
    
    Include multiple scenarios where appropriate to cover edge cases.
    
    GUIDELINES:
    - Be comprehensive but concise
    - Ensure all requirements from the brief are covered
    - Maintain consistency in terminology
    - Focus on testable, measurable criteria
    - Consider both happy path and edge cases"""

    return LlmAgent(
        name="ProductOwner",
        model="gemini-2.0-flash",
        instruction=instruction,
        description="Generates user stories and acceptance criteria from validated requirements",
        # Saves output to state['stories_and_criteria']
        output_key="stories_and_criteria"
    )


def create_estimator_agent():
    """Create the Agile Coach/Estimator agent."""
    instruction = """You are an expert Agile Coach specializing in relative estimation 
    and Story Point assessment. You have facilitated hundreds of estimation 
    sessions and understand the nuances of complexity assessment.
    
    TASK:
    Analyze the user stories from {stories_and_criteria} and assign Story Point estimates based on 
    relative complexity, effort, and uncertainty.
    
    ESTIMATION FRAMEWORK:
    Use the Fibonacci sequence: 1, 2, 3, 5, 8, 13
    
    REFERENCE MODEL:
    - 1 point: Trivial change (e.g., text update, simple config change)
    - 2 points: Simple feature (e.g., basic CRUD operation, simple validation)
    - 3 points: Moderate complexity (e.g., multi-step workflow, basic integration)
    - 5 points: Significant complexity (e.g., complex business logic, external API integration)
    - 8 points: High complexity (e.g., new architectural component, complex algorithm)
    - 13 points: Very high complexity (e.g., major system redesign, multiple integrations)
    
    COMPLEXITY FACTORS TO CONSIDER:
    1. Technical Complexity: Algorithm complexity, data processing needs
    2. Integration Points: Number of systems/components involved
    3. Business Logic: Complexity of rules and validations
    4. Data Volume: Amount of data to process or migrate
    5. User Interface: Complexity of UI/UX requirements
    6. Testing Effort: Test scenarios and edge cases
    7. Uncertainty: Unknown factors or dependencies
    8. Performance Requirements: Optimization needs
    
    OUTPUT FORMAT:
    Generate a Markdown table with exactly three columns:
    
    | User Story | Story Points | Justification |
    |------------|--------------|---------------|
    | [Story description] | [Points] | [Brief explanation of complexity factors] |
    
    GUIDELINES:
    - Be consistent in your relative assessments
    - Consider all complexity factors, not just development time
    - Provide clear, concise justifications
    - If a story seems larger than 13 points, note it should be decomposed"""

    return LlmAgent(
        name="AgileCoach",
        model="gemini-2.0-flash",
        instruction=instruction,
        description="Provides Story Point estimates for user stories",
        output_key="estimations"  # Saves output to state['estimations']
    )


def create_report_generator_agent():
    """Create the Report Generator agent."""
    instruction = """You are a technical documentation specialist. Your task is to compile 
    all the project artifacts into a comprehensive final report.
    
    Using the following inputs:
    - Validated Brief: {validated_brief}
    - User Stories and Acceptance Criteria: {stories_and_criteria}
    - Story Point Estimations: {estimations}
    
    Generate a well-formatted Markdown report with the following structure:
    
    # MARES: Functional Design & Estimation Report
    
    ## Executive Summary
    Provide a brief overview of the project scope and key metrics.
    
    ## 1. Validated Project Requirements
    Include the complete validated brief.
    
    ## 2. Development Artifacts
    ### 2.1 Actors and Use Cases
    ### 2.2 User Stories
    ### 2.3 Acceptance Criteria
    
    ## 3. Complexity Estimation
    Include the story points table and total estimated effort.
    
    ## 4. Implementation Recommendations
    Based on the analysis, provide key recommendations for the development team.
    
    Make the report professional, clear, and ready for stakeholder review."""

    return LlmAgent(
        name="ReportGenerator",
        model="gemini-2.0-flash",
        instruction=instruction,
        description="Compiles all artifacts into a final report",
        output_key="final_report"
    )


class InitializeBriefAgent(LlmAgent):
    """
    Custom agent that initializes the project brief in the state
    from the user's message.
    """

    def __init__(self):
        super().__init__(
            name="BriefInitializer",
            description="Extracts and saves the project brief from user input",
            instruction="Get the project_brief from the user and store it in the state so it can be used by  the next agent",
            output_key="project_brief"
        )


# Create the main coordinator agent that orchestrates the workflow
def create_mares_coordinator():
    """
    Create the main MARES coordinator agent using ADK's multi-agent patterns.
    This implements the Sequential Pipeline Pattern with all three specialist agents.
    """

    # Create the initialization agent
    initializer = InitializeBriefAgent()

    # Create the specialist agents
    analyst = create_analyst_agent()
    scripter = create_scripter_agent()
    estimator = create_estimator_agent()
    report_generator = create_report_generator_agent()
    validator = AnalystValidationAgent()

    # Create the main sequential pipeline
    main_pipeline = SequentialAgent(
        name="MARESPipeline",
        description="Main MARES workflow pipeline",
        sub_agents=[
            initializer,  # Step 0: Initialize the brief in state
            analyst,      # Step 1: Analyze and validate requirements
            validator,    # Step 2: Check if validation is complete
            scripter,     # Step 3: Generate user stories and acceptance criteria
            estimator,    # Step 4: Estimate story points
            report_generator  # Step 5: Generate final report
        ]
    )

    # Create the coordinator agent that manages the overall process
    coordinator_instruction = """You are the MARES Project Coordinator, managing a team of specialist agents
    to analyze software requirements and generate development artifacts.
    
    Your team consists of:
    1. BusinessAnalyst - Validates requirements and asks clarifying questions
    2. ProductOwner - Creates user stories and acceptance criteria
    3. AgileCoach - Estimates story complexity
    4. ReportGenerator - Compiles the final report
    
    You will start by welcoming the user and asking for the client brief. Once you received the 
    client brief you should take the following steps:
    1. Save it to the temporary state for the pipeline to access
    2. Delegate to the MARESPipeline to run the complete analysis workflow
    3. Monitor the process and handle any user interactions needed
    4. Ensure all steps complete successfully
    5. Present the final report to the user
    
    
    Extract the project brief from the user's message and save it to temp:project_brief, then transfer to MARESPipeline."""

    coordinator = LlmAgent(
        name="MARESCoordinator",
        model="gemini-2.0-flash",
        instruction=coordinator_instruction,
        description="Orchestrates the MARES requirements analysis process",
        sub_agents=[main_pipeline]  # Pipeline is a sub-agent of coordinator
    )

    return coordinator


# Main entry point - create the root agent
root_agent = create_mares_coordinator()
