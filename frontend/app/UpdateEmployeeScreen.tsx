import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { updateEmployee } from './api';

const UpdateEmployeeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { employee } = route.params;
    const [name, setName] = useState(employee.name);
    const [position, setPosition] = useState(employee.position);
    const [salary, setSalary] = useState(employee.salary.toString());

    const handleUpdateEmployee = async () => {
        // Basic validation
        if (!name || !position || !salary) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const updatedEmployee = await updateEmployee(employee.id, {
                name,
                position,
                salary: parseFloat(salary)
            });

            Alert.alert('Success', 'Employee updated successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update employee');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Employee</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Position"
                value={position}
                onChangeText={setPosition}
            />

            <TextInput
                style={styles.input}
                placeholder="Salary"
                value={salary}
                onChangeText={setSalary}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdateEmployee}
            >
                <Text style={styles.buttonText}>Update Employee</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: 'blue',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default UpdateEmployeeScreen;