import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getEmployee, uploadProfilePicture } from './api';
import blankProfilePicture from '../assets/images/blank-profile-picture.png';
import Icon from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'expo-image-picker';

const UpdateEmployeeScreen = ({ route }: { route: any }) => {
    const { employeeId } = route.params;
    const [employee, setEmployee] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [profilePicture, setProfilePicture] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const employeeData = await getEmployee(employeeId);
                setEmployee(employeeData);
                setProfilePicture(employeeData.body.profilePicture || null);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchEmployeeDetails();
    }, []);

    const handleImageSelect = async () => {
        // Request permissions
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access the gallery is required!');
            return;
        }

        // Launch the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            base64: true, // Ensure base64 data is included
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            // Add the base64 string to the data URI format
            const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
            console.log("Selected Image Base64:", base64Image); // Log the base64 image for debugging

            try {
                // Now send the base64 string to the backend
                const response = await uploadProfilePicture(employeeId, base64Image); // Log the response 
                setProfilePicture(base64Image);
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            }
        } else {
            alert('You did not select any image.');
        }
    };

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!employee) {
        return (
            <View>
                <Text>Employee not found.</Text>
            </View>
        );
    }

    return (
        <View>
            {/* Profile Picture Section */}
            <View style={styles.profilePictureContainer}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : blankProfilePicture}
                    style={styles.profilePicture}
                />
                <TouchableOpacity style={styles.addIconContainer} onPress={handleImageSelect}>
                    {/* Use the camera icon instead of + */}
                    <Icon name="camerao" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    profilePictureContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    profilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: 'white',
    },
    addIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
});

export default UpdateEmployeeScreen;
