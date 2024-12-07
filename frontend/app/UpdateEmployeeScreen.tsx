import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { updateEmployee } from './api';
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const UpdateEmployeeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { employee } = route.params;
    const [name, setName] = useState(employee.name);
    const [position, setPosition] = useState(employee.position);
    const [salary, setSalary] = useState(employee.salary.toString());
    const [profilePicture, setProfilePicture] = useState<string | null>(null); // State to store the selected image

    const handleUpdateEmployee = async () => {
        // Basic validation
        if (!name || !position || !salary) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('salary', salary);

        // If a profile picture is selected, append it to the FormData
        if (profilePicture) {
            const file = {
                uri: profilePicture,
                name: 'profile.jpg', // You can change the name as per your requirement
                type: 'image/jpeg',
            };
            formData.append('profilePicture', file);
        }

        try {
            const updatedEmployee = await updateEmployee(employee.id, formData);

            Alert.alert('Success', 'Employee updated successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update employee');
            console.error(error);
        }
    };

    // Function to handle profile picture selection
    const handleProfilePictureChange = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error: ', response.errorMessage);
            } else {
                setProfilePicture(response.assets?.[0].uri || null); // Save the selected image URI
            }
        });
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

            {/* Display the selected profile picture */}
            {profilePicture && (
                <Image
                    source={{ uri: profilePicture }}
                    style={styles.profilePicture}
                />
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={handleProfilePictureChange} // Button to select a profile picture
            >
                <Text style={styles.buttonText}>Select Profile Picture</Text>
            </TouchableOpacity>

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
        marginBottom: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        alignSelf: 'center',
    },
});

export default UpdateEmployeeScreen;
