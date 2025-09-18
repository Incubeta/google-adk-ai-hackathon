import { Card } from "@/components/ui/card";
import {
  FileText,
  Sparkles,
  Code2,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Users,
  Rocket
} from "lucide-react";

interface HowItWorksProps {
  className?: string;
}

export function HowItWorks({ className = "" }: HowItWorksProps) {
  const steps = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "1. Submit Your Project Brief",
      description: "Start by pasting your initial project idea, feature request, or stakeholder brief into the text box. It can be as simple as a few sentences or a more detailed paragraph or an uploaded pdf ",
      example: "Example: 'I need a customer portal for managing subscriptions'"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "2. Chat with Your AI Analyst",
      description: "Our AI Analyst will instantly review your brief for any gaps or ambiguities. It will then ask you a series of clarifying questions to ensure every detail is covered—from user roles and scope to security and data requirements. Simply type your answers in the chat. This interactive process continues until the AI confirms the brief is 100% clear.",
      example: "MARES identifies: user roles, key features, technical constraints, and business rules"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "3.  Receive Your Complete Functional Design",
      description: "Once the requirements are locked, the MARES system gets to work. In a few moments, it will automatically generate and deliver a comprehensive design document that includes: A final, validated project brief, A full backlog of User Stories with detailed Acceptance Criteria. Story Point estimates for each story with clear justifications. You can then download this report and hand it directly to your architecture and development teams to start building.",
      example: ""
    },
  ];

  const benefits = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      text: "Reduce project planning time by 80%"
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      text: "Eliminate requirement gaps and ambiguities"
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      text: "Ensure consistent documentation standards"
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,
      text: "Accelerate time-to-market"
    }
  ];

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">How MARES Works</h2>
        <p className="text-neutral-300 max-w-2xl mx-auto">
          Transform your ideas into actionable development plans in minutes, not weeks
        </p>
      </div>

      {/* Process Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="bg-neutral-800/50 border-neutral-700 p-6 hover:bg-neutral-800/70 transition-all duration-200"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  {step.icon}
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="text-neutral-300">{step.description}</p>
                <p className="text-sm text-neutral-400 italic">{step.example}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-shrink-0 self-center">
                  <ArrowRight className="w-5 h-5 text-neutral-600" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700/30 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Key Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              {benefit.icon}
              <span className="text-neutral-200">{benefit.text}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <p className="text-neutral-300 mb-4">
          Ready to revolutionize your project planning?
        </p>
        <p className="text-sm text-neutral-400">
          Simply describe your project above and let MARES do the heavy lifting!
        </p>
      </div>
    </div>
  );
}

