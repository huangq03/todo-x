"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Settings, Database, Cloud, Palette, Shield, Zap, Brain, Save, RotateCcw } from "lucide-react"
import { useTheme } from "next-themes"
import { USE_MOCK_API } from "@/lib/api-config"

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme()
  const [settings, setSettings] = useState({
    autoSave: true,
    notifications: true,
    animations: true,
    compactMode: false,
    aiSuggestions: true,
    focusMode: false,
    apiEndpoint: "",
    maxNodes: 50,
    autoBackup: true,
  })

  const handleSettingChange = (key: string, value: boolean | string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem("mindtask-settings", JSON.stringify(settings))
    onClose()
  }

  const handleReset = () => {
    setSettings({
      autoSave: true,
      notifications: true,
      animations: true,
      compactMode: false,
      aiSuggestions: true,
      focusMode: false,
      apiEndpoint: "",
      maxNodes: 50,
      autoBackup: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>Customize your MindTask AI experience</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="ai">AI & Data</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <div className="max-h-[60vh] overflow-y-auto mt-4">
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Productivity
                  </CardTitle>
                  <CardDescription>Configure your productivity preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-save changes</Label>
                      <p className="text-sm text-muted-foreground">Automatically save your work as you type</p>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable notifications</Label>
                      <p className="text-sm text-muted-foreground">Get notified about task deadlines and updates</p>
                    </div>
                    <Switch
                      checked={settings.notifications}
                      onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto backup</Label>
                      <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum nodes per mind map</Label>
                    <Input
                      type="number"
                      value={settings.maxNodes}
                      onChange={(e) => handleSettingChange("maxNodes", Number.parseInt(e.target.value))}
                      min="10"
                      max="200"
                    />
                    <p className="text-sm text-muted-foreground">Limit the number of nodes to maintain performance</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme & Display
                  </CardTitle>
                  <CardDescription>Customize the look and feel of your workspace</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                      >
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                      >
                        Dark
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("system")}
                      >
                        System
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Smooth animations</Label>
                      <p className="text-sm text-muted-foreground">Enable smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={settings.animations}
                      onCheckedChange={(checked) => handleSettingChange("animations", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Compact mode</Label>
                      <p className="text-sm text-muted-foreground">Use a more compact layout to fit more content</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    AI Features
                  </CardTitle>
                  <CardDescription>Configure AI assistance and data handling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>AI suggestions</Label>
                      <p className="text-sm text-muted-foreground">
                        Get intelligent suggestions for tasks and organization
                      </p>
                    </div>
                    <Switch
                      checked={settings.aiSuggestions}
                      onCheckedChange={(checked) => handleSettingChange("aiSuggestions", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={USE_MOCK_API ? "secondary" : "default"}>
                        {USE_MOCK_API ? (
                          <>
                            <Database className="h-3 w-3 mr-1" />
                            Mock Data
                          </>
                        ) : (
                          <>
                            <Cloud className="h-3 w-3 mr-1" />
                            Live Database
                          </>
                        )}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {USE_MOCK_API
                          ? "Using local mock data for demonstration"
                          : "Connected to live Supabase database"}
                      </p>
                    </div>
                  </div>

                  {!USE_MOCK_API && (
                    <div className="space-y-2">
                      <Label>Custom API Endpoint</Label>
                      <Input
                        placeholder="https://your-api.com"
                        value={settings.apiEndpoint}
                        onChange={(e) => handleSettingChange("apiEndpoint", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">Override the default API endpoint (optional)</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Advanced Settings
                  </CardTitle>
                  <CardDescription>Advanced configuration options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Focus mode by default</Label>
                      <p className="text-sm text-muted-foreground">Start in focus mode when viewing tasks</p>
                    </div>
                    <Switch
                      checked={settings.focusMode}
                      onCheckedChange={(checked) => handleSettingChange("focusMode", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Keyboard Shortcuts</Label>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Toggle AI Chat</span>
                        <Badge variant="outline">Ctrl + K</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Add New Node</span>
                        <Badge variant="outline">Ctrl + N</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Focus Mode</span>
                        <Badge variant="outline">Ctrl + F</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Save</span>
                        <Badge variant="outline">Ctrl + S</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button onClick={handleReset} variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
