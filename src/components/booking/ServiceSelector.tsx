
import React from "react";
import { Service } from "@/data/services";

interface ServiceSelectorProps {
  services: Service[];
  selectedService?: string;
  disabled?: boolean;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ services, selectedService, disabled }) => {
  return (
    <select 
      id="service" 
      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
      required
      defaultValue={selectedService || ""}
      disabled={disabled}
    >
      <option value="">Select a service</option>
      {services.map(service => (
        <option key={service.id} value={service.name}>
          {service.name} - ${service.price}
        </option>
      ))}
    </select>
  );
};

export default ServiceSelector;
