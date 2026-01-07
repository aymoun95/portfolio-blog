import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

export const SubmitBtn = ({ isPending }: { isPending: boolean }) => {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={isPending}
      className="w-full gap-2"
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          <Send className="w-4 h-4" />
          Send Message
        </>
      )}
    </Button>
  );
};
