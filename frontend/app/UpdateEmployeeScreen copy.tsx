import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image
} from 'react-native';
import { updateEmployee, uploadProfilePicture, getEmployee } from './api';
import { launchImageLibrary } from 'react-native-image-picker';

// Import the blank profile picture
const blankProfilePicture = require('../assets/images/blank-profile-picture.png');

const UpdateEmployeeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { employeeId } = route.params;
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                console.log({employeeId})
                const employee = await getEmployee(employeeId);
                setName(employee.name);
                setPosition(employee.position);
                setSalary(employee.salary.toString());
                setProfilePicture(employee.profilePicture || null);
            } catch (error) {
                console.error('Error fetching employee data:', error);
                Alert.alert('Error', 'Failed to load employee data');
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    const handleUpdateEmployee = async () => {
        // Basic validation
        if (!name || !position || !salary) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            // Update employee details
            const updatedEmployeeData = {
                name,
                position,
                salary: parseFloat(salary),
                id: employeeId
            };

            await updateEmployee(employeeId, updatedEmployeeData);

            // If a new image is selected, upload it
            if (selectedImageUri) {
                const base64Image = await convertImageToBase64(selectedImageUri);
                await uploadProfilePicture(employeeId, base64Image);
            }

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

    const convertImageToBase64 = async (uri: string): Promise<string> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    // Function to handle profile picture selection
    const handleProfilePictureChange = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, (response) => {
            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.errorMessage) {
                console.error('Image Picker Error: ', response.errorMessage);
            } else {
                const uri = response.assets?.[0].uri;
                if (uri) {
                    setSelectedImageUri(uri);
                }
            }
        });
    };

    return (
        <View style={styles.container}>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
                <Image
                    source={
                        selectedImageUri
                            ? { uri: selectedImageUri }
                            : (profilePicture && profilePicture.trim() !== ''
                                ? { uri: profilePicture }
                                : blankProfilePicture)
                    }
                    style={styles.profilePicture}
                />
                <TouchableOpacity
                    style={styles.editProfilePictureButton}
                    onPress={handleProfilePictureChange}
                >
                    <Text style={styles.editProfilePictureText}>
                        {selectedImageUri ? 'Update' : 'Add'} Profile Picture
                    </Text>
                </TouchableOpacity>
            </View>

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
    profilePictureContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: 'white',
        marginBottom: 12,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    editProfilePictureButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    editProfilePictureText: {
        color: 'white',
        fontWeight: 'bold',
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
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default UpdateEmployeeScreen;