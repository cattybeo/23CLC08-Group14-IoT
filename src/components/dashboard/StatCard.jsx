import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, subtitle, icon: Icon, variant = "default", badgeText }) => {
  const variants = {
    default: {
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      valueColor: "text-foreground",
      badgeBg: "",
      badgeText: "",
    },
    danger: {
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      valueColor: "text-destructive",
      badgeBg: "bg-destructive/10 text-destructive hover:bg-destructive/20",
      badgeText: "",
    },
    success: {
      iconBg: "bg-success/10",
      iconColor: "text-success",
      valueColor: "text-foreground",
      badgeBg: "bg-success/10 text-success hover:bg-success/20",
      badgeText: "",
    },
  };

  const style = variants[variant] || variants.default;

  return (
    <Card className="border-0 shadow-xs">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight", style.valueColor)}>
              {value}
            </p>
            {badgeText ? (
              <Badge className={cn("font-medium text-xs whitespace-nowrap", style.badgeBg)}>
                {badgeText}
              </Badge>
            ) : (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", style.iconBg)}>
            <Icon className={cn("h-6 w-6", style.iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
