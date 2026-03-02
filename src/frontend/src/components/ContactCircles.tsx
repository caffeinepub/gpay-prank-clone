import React from "react";
import { CONTACTS, type Contact } from "../utils/contactData";

interface ContactCirclesProps {
  onContactClick: (contact: Contact) => void;
}

export default function ContactCircles({
  onContactClick,
}: ContactCirclesProps) {
  return (
    <div className="px-4 py-2">
      <p
        className="text-xs font-medium mb-3"
        style={{ color: "oklch(0.55 0.02 250)" }}
      >
        People
      </p>
      <div className="flex justify-around">
        {CONTACTS.map((contact) => (
          <button
            type="button"
            key={contact.id}
            onClick={() => onContactClick(contact)}
            className="flex flex-col items-center gap-2 group"
          >
            <div
              className="relative w-14 h-14 rounded-full overflow-hidden transition-transform group-hover:scale-105 group-active:scale-95"
              style={{
                border: "2px solid oklch(0.25 0.025 250)",
                boxShadow: "0 2px 8px oklch(0 0 0 / 0.3)",
              }}
            >
              <img
                src={contact.avatarPath}
                alt={contact.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const parent = target.parentElement;
                  if (parent) {
                    parent.style.background = contact.color;
                    const span = document.createElement("span");
                    span.textContent = contact.initials;
                    span.style.cssText =
                      "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.1rem;color:white;";
                    parent.appendChild(span);
                  }
                }}
              />
            </div>
            <span
              className="text-xs font-medium text-center max-w-[72px] leading-tight"
              style={{ color: "oklch(0.80 0.01 250)" }}
            >
              {contact.name.split(" ")[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
