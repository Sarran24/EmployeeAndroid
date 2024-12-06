import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import { createEmployee } from './api';

const CreateEmployeeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');

    const handleCreateEmployee = async () => {
        // Basic validation
        if (!name || !position || !salary) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const newEmployee = await createEmployee({
                name,
                position,
                salary: parseFloat(salary)
            });

            Alert.alert('Success', 'Employee created successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to create employee');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create New Employee</Text>

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
                onPress={handleCreateEmployee}
            >
                <Text style={styles.buttonText}>Create Employee</Text>
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

export default CreateEmployeeScreen;