import React, { useState } from "react";
import { MessageCircle, Plus, Search, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplaintChatbot } from "./ComplaintChatbot";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

export function UserDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: "TICKET-001",
      title: "Login Issues",
      description: "Unable to login to my account",
      category: "Technical",
      priority: "High",
      status: "In Progress",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-16"),
    },
    {
      id: "TICKET-002",
      title: "Billing Discrepancy",
      description: "Incorrect charges on my account",
      category: "Billing",
      priority: "Medium",
      status: "Open",
      createdAt: new Date("2024-01-14"),
      updatedAt: new Date("2024-01-14"),
    },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <Clock className="h-4 w-4" />;
      case "In Progress": return <AlertTriangle className="h-4 w-4" />;
      case "Resolved": return <CheckCircle className="h-4 w-4" />;
      case "Closed": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleComplaintGenerated = (newComplaint: any) => {
    const complaint: Complaint = {
      ...newComplaint,
      title: newComplaint.description.slice(0, 50) + "...",
      updatedAt: new Date(),
    };
    setComplaints(prev => [complaint, ...prev]);
    setIsChatbotOpen(false);
  };

  const filteredComplaints = complaints.filter(complaint =>
    complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    complaint.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsData = [
    {
      title: "Total Complaints",
      value: complaints.length,
      description: "All time submissions",
    },
    {
      title: "Open Issues",
      value: complaints.filter(c => c.status === "Open" || c.status === "In Progress").length,
      description: "Awaiting resolution",
    },
    {
      title: "Resolved",
      value: complaints.filter(c => c.status === "Resolved" || c.status === "Closed").length,
      description: "Successfully handled",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Complaints</h1>
            <p className="text-muted-foreground">Track and manage your support requests</p>
          </div>
          <Button onClick={() => setIsChatbotOpen(true)} className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            New Complaint
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-2xl">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search complaints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No complaints found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? "No complaints match your search criteria." : "You haven't submitted any complaints yet."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setIsChatbotOpen(true)}>
                    Submit Your First Complaint
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredComplaints.map((complaint) => (
              <Card key={complaint.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(complaint.status)}
                      <div>
                        <CardTitle className="text-lg">{complaint.title}</CardTitle>
                        <CardDescription>#{complaint.id}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(complaint.priority)}>
                        {complaint.priority}
                      </Badge>
                      <Badge variant="outline">{complaint.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{complaint.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Category: {complaint.category}</span>
                    <span>Updated: {complaint.updatedAt.toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <ComplaintChatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        onComplaintGenerated={handleComplaintGenerated}
      />
    </div>
  );
}