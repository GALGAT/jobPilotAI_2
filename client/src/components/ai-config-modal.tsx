
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Eye, EyeOff } from "lucide-react";

interface AIProvider {
  name: string;
  displayName: string;
  apiKeyUrl: string;
}

interface AIConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (config: { provider: string; apiKey: string; saveLocally: boolean }) => void;
  currentConfig?: { provider: string; apiKey: string } | null;
}

export function AIConfigModal({ open, onOpenChange, onSave, currentConfig }: AIConfigModalProps) {
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [saveLocally, setSaveLocally] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch("/api/ai-providers");
        const data = await response.json();
        setProviders(data);
        
        if (currentConfig) {
          setSelectedProvider(currentConfig.provider);
          setApiKey(currentConfig.apiKey);
        } else if (data.length > 0) {
          setSelectedProvider(data[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch AI providers:", error);
      }
    }

    if (open) {
      fetchProviders();
    }
  }, [open, currentConfig]);

  const handleSave = () => {
    if (!selectedProvider || !apiKey.trim()) {
      return;
    }

    onSave({
      provider: selectedProvider,
      apiKey: apiKey.trim(),
      saveLocally
    });

    onOpenChange(false);
  };

  const selectedProviderInfo = providers.find(p => p.name === selectedProvider);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure AI Provider</DialogTitle>
          <DialogDescription>
            Choose your preferred AI service and enter your API key to enable AI features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.name} value={provider.name}>
                    {provider.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProviderInfo && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Get your API key:</span>
                <a
                  href={selectedProviderInfo.apiKeyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>{selectedProviderInfo.displayName}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveLocally"
              checked={saveLocally}
              onCheckedChange={setSaveLocally}
            />
            <Label htmlFor="saveLocally" className="text-sm">
              Save configuration locally (encrypted in browser storage)
            </Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!selectedProvider || !apiKey.trim() || loading}
            >
              Save Configuration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
