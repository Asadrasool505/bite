"use client";

export default function FloatingWhatsApp() {
  const whatsappUrl =
    "https://wa.me/923001234567?text=Hello%20Bite%20Instruments%2C%20I%20am%20interested%20in%20wholesale%20grooming%20tools.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Bite Instruments on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
      style={{
        boxShadow: "0 8px 32px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.18)",
      }}
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30"
        aria-hidden="true"
      />
      {/* WhatsApp SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        fill="white"
        className="w-7 h-7 relative z-10"
        aria-hidden="true"
      >
        <path d="M16.002 2C8.27 2 2 8.269 2 15.998c0 2.49.654 4.822 1.793 6.847L2 30l7.363-1.771A13.945 13.945 0 0016.002 30C23.731 30 30 23.73 30 16.002 30 8.27 23.731 2 16.002 2zm0 25.563a11.546 11.546 0 01-5.876-1.606l-.421-.25-4.37 1.05 1.082-4.253-.276-.438a11.511 11.511 0 01-1.704-6.068C4.437 9.07 9.572 3.938 16.002 3.938c6.429 0 11.562 5.13 11.562 11.56 0 6.43-5.133 11.565-11.562 11.565zm6.338-8.663c-.347-.173-2.057-1.013-2.376-1.128-.32-.115-.553-.173-.786.173-.232.346-.9 1.127-1.103 1.36-.202.232-.405.26-.752.087-.347-.173-1.463-.54-2.786-1.716-1.03-.917-1.725-2.05-1.928-2.396-.202-.346-.022-.533.152-.705.157-.155.347-.405.52-.607.173-.202.231-.346.347-.578.115-.232.058-.433-.029-.607-.087-.173-.786-1.896-1.077-2.596-.283-.68-.57-.588-.786-.598l-.669-.012c-.232 0-.607.087-.926.433s-1.214 1.185-1.214 2.89c0 1.706 1.243 3.353 1.416 3.585.173.232 2.447 3.735 5.928 5.24.828.357 1.474.57 1.977.73.83.264 1.586.226 2.183.137.666-.1 2.057-.841 2.348-1.653.29-.81.29-1.507.203-1.653-.086-.145-.318-.232-.665-.405z" />
      </svg>
    </a>
  );
}
