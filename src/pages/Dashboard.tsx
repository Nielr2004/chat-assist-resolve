import React, { useState } from "react";
import { UserDashboard } from "@/components/UserDashboard";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";
import { Users, Shield, MessageCircle } from "lucide-react";
import { ComplaintChatbot } from "@/components/ComplaintChatbot";

export default function Dashboard() {
  const [dashboardType, setDashboardType] = useState<"user" | "admin">("user");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Toggle */}
      <div className="bg-card border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Complaint Management System</h1>
          <div className="flex gap-2">
            <Button
              variant={dashboardType === "user" ? "default" : "outline"}
              onClick={() => setDashboardType("user")}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              User View
            </Button>
            <Button
              variant={dashboardType === "admin" ? "default" : "outline"}
              onClick={() => setDashboardType("admin")}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Admin View
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      {dashboardType === "user" ? <UserDashboard /> : <AdminDashboard />}
       {/* Floating Chatbot Icon */}
       <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="default"
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
        >
          <MessageCircle className="h-8 w-8" />
        </Button>
      </div>
      {/* Chatbot Pop-up */}
      <ComplaintChatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
}