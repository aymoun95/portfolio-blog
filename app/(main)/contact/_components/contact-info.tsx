import { Linkedin, Mail, MapPin } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "aymenbenzlaouia95@gmail.com",
    description: "I'll respond don't worry",
  },
  {
    icon: Linkedin,
    title: "Linkedin",
    value: "ben-zlaouia-aymen",
    description: "Available Mon-Fri, 9AM-6PM EST",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "Germany, Tunisia",
    description: "Available for remote or on site work worldwide",
  },
];

export const ContactInfo = () => {
  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground">
        Contact Information
      </h2>

      <div className="space-y-6">
        {contactInfo.map((info) => (
          <div key={info.title} className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <info.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">{info.title}</h3>
              <p className="text-muted-foreground">{info.value}</p>
              <p className="text-sm text-muted-foreground">
                {info.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
