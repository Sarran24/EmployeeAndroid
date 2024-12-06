import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

interface User {
  id: number;
  name: string;
  position: string;
  salary: number;
}

export default function App() {
  const [employee, setEmployee] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const res = await fetch('https://jsonplaceholder.typicode.com/users');
        const res = await fetch('http://192.168.1.8:8080/employees');
        const result: User[] = await res.json();
        setEmployee(result);
      } catch (error) {
        console.error('Error while fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View>
      <Text>User List</Text>
      {employee.map((employe) => (
        <View key={employe.id}>
          <Text>Name: {employe.name}</Text>
          <Text>Position: {employe.position}</Text>
          <Text>Salary: {employe.salary}</Text>
        </View>
      ))}
    </View>
  );
}



// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// export default function App() {
//   const [users, setUsers] = useState<User[]>([]); // Using 'User' instead of 'Employee'

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await fetch('https://jsonplaceholder.typicode.com/users');
//         const result: User[] = await res.json();
//         setUsers(result);
//       } catch (error) {
//         console.error('Error while fetching users:', error);
//       }
//     };

//     fetchUsers(); // Invoke the function
//   }, []);

//   return (
//     <View>
//       <Text>User List</Text>
//       {users.map((user) => (
//         <View key={user.id}>
//           <Text>Name: {user.name}</Text>
//           <Text>Email: {user.email}</Text>
//         </View>
//       ))}
//     </View>
//   );
// }
