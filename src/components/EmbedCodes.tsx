import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ClipboardCopy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmbedCodesProps {
  embedId: string;
}

export const EmbedCodes = ({ embedId }: EmbedCodesProps) => {
  const { toast } = useToast();
  const baseUrl = window.location.origin;

  const jsCode = `<div id="podcast-player-container">
  <div id="podcast-player"></div>
</div>
<script src="${baseUrl}/embed.js?id=${embedId}"></script>`;

  const iframeCode = `<iframe src="${baseUrl}/embed/${embedId}" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Code kopiert!",
        description: `Der ${type}-Embed-Code wurde in die Zwischenablage kopiert.`,
      });
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <h3 className="text-lg font-semibold">Embed-Codes</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">JavaScript Embed</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(jsCode, "JavaScript")}
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="p-2 bg-muted rounded-md text-sm overflow-x-auto">
            {jsCode}
          </pre>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">iFrame Embed</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(iframeCode, "iFrame")}
            >
              <ClipboardCopy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="p-2 bg-muted rounded-md text-sm overflow-x-auto">
            {iframeCode}
          </pre>
        </div>
      </div>
    </Card>
  );
};