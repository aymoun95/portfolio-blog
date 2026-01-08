import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const WorkTogether = () => {
  return (
    <Card className="bg-muted/50 gap-0">
      <CardHeader>
        <CardTitle className="text-lg">Let's work together!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          I'm always interested in new opportunities and exciting projects.
          Whether you need a full-stack developer, want to collaborate on an
          open-source project, or just want to chat about technology, I'd love
          to hear from you.
        </p>
      </CardContent>
    </Card>
  );
};
