import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { getEmployee, updateEmployee } from './api';
import Icon from 'react-native-vector-icons/AntDesign';
const blankProfilePicture = require('../assets/images/blank-profile-picture.png');
import * as ImagePicker from 'expo-image-picker';
import { uploadProfilePicture } from './api'; // Import the uploadProfilePicture function

const UpdateEmployeeScreen: React.FC<{ route: any, navigation: any }> = ({ route, navigation }) => {
    const { employeeId } = route.params;
    const [employee, setEmployee] = useState<any>(null);
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [salary, setSalary] = useState<number | string>(''); // Salary should be a number or empty string
    const [profilePicture, setProfilePicture] = useState<string>(blankProfilePicture); // Always a string

    console.log(profilePicture)

    // Fetch employee details on screen load
    // useEffect(() => {
    //     const fetchEmployeeDetails = async () => {
    //         try {
    //             const employeeData = await getEmployee(employeeId);
    //             setEmployee(employeeData);
    //             setName(employeeData.body.name || '');
    //             setPosition(employeeData.body.position || '');
    //             setSalary(employeeData.body.salary || ''); // Set the salary correctly as a number or empty string
    //             // Set profile picture
    //             const fetchedProfilePicture = employeeData?.body?.profilePicture || blankProfilePicture;

    //             setProfilePicture(fetchedProfilePicture);
    //         } catch (error) {
    //             console.error('Error fetching employee details:', error);
    //         }
    //     };
    //     fetchEmployeeDetails();
    // }, [employeeId]);


    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeData = await getEmployee(employeeId);
                setEmployee(employeeData);
                setName(employeeData.body.name || '');
                setPosition(employeeData.body.position || '');
                setSalary(employeeData.body.salary || '');

                // Enhanced profile picture handling
                const fetchedProfilePicture = employeeData?.body?.profilePicture;
                if (fetchedProfilePicture) {
                    // If it's a base64 image, ensure it starts with data:image
                    const processedProfilePicture = fetchedProfilePicture.startsWith('data:image')
                        ? fetchedProfilePicture
                        : `data:image/jpeg;base64,${fetchedProfilePicture}`;
                    setProfilePicture(processedProfilePicture);
                } else {
                    setProfilePicture(blankProfilePicture);
                }
            } catch (error) {
                console.error('Error fetching employee details:', error);
            }
        };
        fetchEmployeeDetails();
    }, [employeeId]);

    // Handle image selection
    const handleImageSelect = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Required', 'Permission to access the gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            base64: true,
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            // console.log(base64Image)
            setProfilePicture(base64Image);

            // Upload profile picture
            await handleUploadProfilePicture(employeeId, base64Image);
        } else {
            Alert.alert('No Image Selected', 'You did not select any image.');
        }
    };

    // Upload profile picture
    const handleUploadProfilePicture = async (employeeId: string, base64Image: string) => {
        try {
            await uploadProfilePicture(employeeId, base64Image);
            Alert.alert('Success', 'Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            Alert.alert('Error', 'Failed to update profile picture');
        }
    };

    // Update employee details
    const handleUpdateEmployee = async () => {
        if (!name || !position || salary === '') {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const updatedEmployee = {
            id: employeeId,
            name,
            position,
            salary: typeof salary === 'string' ? parseFloat(salary) : salary,
            // profilePicture,
            profilePicture: profilePicture !== blankProfilePicture ? profilePicture : null,
            isActive: true,
            departmentId: null,
            roleId: null,
        };

        try {
            await updateEmployee(employeeId, updatedEmployee);
            Alert.alert('Success', 'Employee updated successfully', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error updating employee:', error);
            Alert.alert('Error', 'Failed to update employee');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Employee</Text>
            <View style={styles.profilePictureContainer}>
                <Image
                    source={
                        profilePicture && profilePicture !== blankProfilePicture
                            ? { uri: profilePicture }
                            : blankProfilePicture
                    }
                    style={styles.profilePicture}
                    placeholder={blankProfilePicture}
                    contentFit="cover"
                />
                <TouchableOpacity style={styles.addIconContainer} onPress={handleImageSelect}>
                    <Icon name="camerao" size={30} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.updateForm}>
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
                    value={salary.toString()} // Convert salary to string for TextInput
                    onChangeText={(text) => setSalary(text)} // Handle salary change
                    keyboardType="numeric"
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleUpdateEmployee}>
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
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    updateForm: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
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
