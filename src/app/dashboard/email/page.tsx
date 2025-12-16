"use client"

import { useState } from "react"
import {
  Inbox,
  Star,
  Archive,
  Trash2,
  AlertCircle,
  Search,
  RefreshCw,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const emailHistory = [
  {
    id: 1,
    from: "info, me",
    subject: "Re: Quick Call to Boost Your Brand?",
    preview: "Hi Josh! Sure, Thursday 4 PM EST works. Sending a calendar invite.",
    date: "Apr 21",
    starred: true,
  },
  {
    id: 2,
    from: "Emma",
    subject: "Re: Application Received – UX Designer",
    preview: "Looking forward to it too!",
    date: "Apr 21",
    starred: false,
  },
  {
    id: 3,
    from: "Sarah Johnson",
    subject: "Project Update - Q2 Goals",
    preview: "The team has made excellent progress this quarter...",
    date: "Apr 20",
    starred: false,
  },
  {
    id: 4,
    from: "Mike Chen",
    subject: "Meeting Notes - Strategy Session",
    preview: "Attached are the notes from our strategy session...",
    date: "Apr 19",
    starred: true,
  },
]

export default function EmailPage() {
  const [emailType, setEmailType] = useState<"broadcast" | "direct">("broadcast")
  const [selectedFolder, setSelectedFolder] = useState("inbox")
  const [selectedEmails, setSelectedEmails] = useState<number[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const folders = [
    { id: "inbox", name: "Inbox", icon: Inbox },
    { id: "starred", name: "Starred", icon: Star },
    { id: "archive", name: "Archive", icon: Archive },
    { id: "spam", name: "Spam", icon: AlertCircle },
    { id: "trash", name: "Trash", icon: Trash2 },
  ]

  const toggleEmailSelection = (id: number) => {
    setSelectedEmails((prev) => (prev.includes(id) ? prev.filter((emailId) => emailId !== id) : [...prev, id]))
  }

  return (
    <div className="p-8">
      {/* Email Composer Section */}
      <Card className="mb-8 border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Send className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-foreground">Email</CardTitle>
              <CardDescription>Send broadcast or direct emails to users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Email Type Toggle */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setEmailType("broadcast")}
              className={cn(
                "py-3 px-4 rounded-lg text-sm font-medium transition-all border",
                emailType === "broadcast"
                  ? "bg-foreground/5 border-foreground/20 text-foreground"
                  : "bg-transparent border-border/50 text-muted-foreground hover:bg-foreground/5",
              )}
            >
              Broadcast
            </button>
            <button
              onClick={() => setEmailType("direct")}
              className={cn(
                "py-3 px-4 rounded-lg text-sm font-medium transition-all border",
                emailType === "direct"
                  ? "bg-foreground/5 border-foreground/20 text-foreground"
                  : "bg-transparent border-border/50 text-muted-foreground hover:bg-foreground/5",
              )}
            >
              Direct
            </button>
          </div>

          {/* Email Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">App Filter (Optional)</label>
              <Input placeholder="Leave empty for all apps" className="bg-background border-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Subject</label>
              <Input placeholder="Email subject" className="bg-background border-border" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Message</label>
              <Textarea placeholder="Email message" rows={6} className="bg-background resize-none border-border" />
            </div>

            <Button
              className="w-full bg-foreground/10 hover:bg-foreground/20 text-foreground border border-foreground/20"
              size="lg"
            >
              <Send className="w-4 h-4 mr-2" />
              Send {emailType === "broadcast" ? "Broadcast" : "Direct"} Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email History Section */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Inbox className="w-5 h-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-foreground">Email History</CardTitle>
              <CardDescription>View all sent and received emails</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <div className={cn("transition-all duration-300 ease-in-out", isSidebarCollapsed ? "w-0" : "w-48")}>
              {!isSidebarCollapsed && (
                <div className="space-y-1">
                  {folders.map((folder) => {
                    const Icon = folder.icon
                    return (
                      <button
                        key={folder.id}
                        onClick={() => setSelectedFolder(folder.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          selectedFolder === folder.id
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {folder.name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Email List */}
            <div className="flex-1">
              {/* Search and Actions Bar */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 hover:bg-foreground/5 hover:text-foreground"
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-foreground/5 hover:text-foreground">
                  <CheckSquare className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="shrink-0 hover:bg-foreground/5 hover:text-foreground">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search emails..." className="pl-9 bg-background border-border" />
                </div>
                <span className="text-sm text-muted-foreground shrink-0">1-16</span>
              </div>

              {/* Email Items */}
              <div className="space-y-px">
                {emailHistory.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center gap-4 p-3 hover:bg-foreground/5 rounded-lg cursor-pointer transition-colors group border border-transparent hover:border-border/50"
                    onClick={() => toggleEmailSelection(email.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmails.includes(email.id)}
                      onChange={() => toggleEmailSelection(email.id)}
                      className="w-4 h-4 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="shrink-0"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4 transition-colors",
                          email.starred
                            ? "fill-muted-foreground text-muted-foreground"
                            : "text-muted-foreground/50 hover:text-muted-foreground",
                        )}
                      />
                    </button>
                    <div className="flex-1 min-w-0 grid grid-cols-[120px_1fr_80px] gap-4 items-center">
                      <span className="text-sm font-medium text-foreground truncate">{email.from}</span>
                      <div className="min-w-0">
                        <div className="flex gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{email.subject}</span>
                          <span className="text-sm text-muted-foreground truncate">{email.preview}</span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground text-right">{email.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
