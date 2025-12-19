
export default function Footer() {
  return (
  
    <footer className="bg-white shadow-md h-[40px] flex items-center justify-center">
      <p className="text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} Pet Shelter Pro. All rights reserved.
      </p>
    </footer>
  
  );
}
