import React from 'react';
import { 
  Clapperboard, 
  Megaphone, 
  Building2, 
  Box, 
  User, 
  Camera, 
  PenTool, 
  MessageSquareQuote, 
  Smartphone, 
  Video,
  Sparkles,
  Radio,
  Layers,
  Users
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon = ({ name, className = "w-6 h-6" }: ServiceIconProps) => {
  // Map internal names to user-friendly titles
  const getTitle = (iconName: string) => {
    switch (iconName) {
      case 'Clapperboard': return 'Production / Brand Film';
      case 'Megaphone': return 'Advertising / Promotion';
      case 'Building2': return 'Corporate / Enterprise';
      case 'Box': return 'Product Demonstration';
      case 'User': return 'Personal / Founder Story';
      case 'Camera': return 'Event Coverage';
      case 'PenTool': return 'Animation / Design';
      case 'MessageSquareQuote': return 'Testimonials';
      case 'Smartphone': return 'Social Media';
      case 'Video': return 'UGC / Vlogging';
      case 'Radio': return 'Live Broadcasting';
      case 'Layers': return '3D Visualization';
      case 'Users': return 'Recruitment / HR';
      default: return 'Video Service';
    }
  };

  const props = {
    className,
    'aria-hidden': "false" as const,
    role: "img",
    title: getTitle(name) // Native tooltip
  };

  switch (name) {
    case 'Clapperboard': return <Clapperboard {...props} />;
    case 'Megaphone': return <Megaphone {...props} />;
    case 'Building2': return <Building2 {...props} />;
    case 'Box': return <Box {...props} />;
    case 'User': return <User {...props} />;
    case 'Camera': return <Camera {...props} />;
    case 'PenTool': return <PenTool {...props} />;
    case 'MessageSquareQuote': return <MessageSquareQuote {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Video': return <Video {...props} />;
    case 'Radio': return <Radio {...props} />;
    case 'Layers': return <Layers {...props} />;
    case 'Users': return <Users {...props} />;
    default: return <Sparkles {...props} />;
  }
};