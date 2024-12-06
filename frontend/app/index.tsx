import React from 'react';
import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import EmployeeList from './EmployeeList';
import CreateEmployeeScreen from './CreateEmployeeScreen';
import UpdateEmployeeScreen from './UpdateEmployeeScreen';

// Define the type for the Root Stack Param List
export type RootStackParamList = {
  EmployeeList: undefined;
  CreateEmployee: undefined;
  UpdateEmployee: { employee: any };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="EmployeeList">
          <Stack.Screen
            name="EmployeeList"
            component={EmployeeList}
            options={{ title: 'Sarran Employees' }}
          />
          <Stack.Screen
            name="CreateEmployee"
            component={CreateEmployeeScreen}
            options={{ title: 'Create Employee' }}
          />
          <Stack.Screen
            name="UpdateEmployee"
            component={UpdateEmployeeScreen}
            options={{ title: 'Update Employee' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}