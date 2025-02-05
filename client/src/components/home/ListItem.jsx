const ListItem = ({ children }) => (
    <li className="flex items-center space-x-2">
      <span className="text-purple-500">▹</span>
      <span className="text-lg">{children}</span>
    </li>
  );
  
  export default ListItem;