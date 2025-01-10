"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import HyperText from '../../components/ui/hyper-text';
import { FaPencilAlt, FaTwitter, FaInstagram, FaFacebook, FaMapMarkerAlt, FaPhone, FaUserEdit } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [tempUsername, setTempUsername] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    location: '',
    phoneNumber: '',
    socialLinks: {
      twitter: '',
      instagram: '',
      facebook: ''
    },
    preferences: {
      emailNotifications: true
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`${BACKEND_URL}api/users/profile`, {
          headers: {
            'token': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
        setFormData({
          username: userData.username || '',
          bio: userData.bio || '',
          location: userData.location || '',
          phoneNumber: userData.phoneNumber || '',
          socialLinks: {
            twitter: userData.socialLinks?.twitter || '',
            instagram: userData.socialLinks?.instagram || '',
            facebook: userData.socialLinks?.facebook || ''
          },
          preferences: {
            emailNotifications: userData.preferences?.emailNotifications ?? true
          }
        });
        setTempUsername(userData.username || '');
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (field, value) => {
    try {
      const token = Cookies.get('token');
      const updatedData = { ...formData };
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        updatedData[parent][child] = value;
      } else {
        updatedData[field] = value;
      }

      const response = await fetch(`${BACKEND_URL}api/users/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setFormData(updatedData);
      setMessage('Profile updated successfully!');
      setEditingField(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const EditableField = ({ field, value, type = 'text', icon }) => {
    const [editValue, setEditValue] = useState(value);
    const isEditing = editingField === field;

    return (
      <div className="group relative p-4 hover:bg-gray-50/50 rounded-xl backdrop-blur-sm transition-all duration-300">
        {!isEditing ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                {icon}
              </div>
              <span className="text-gray-700 font-medium whitespace-pre-wrap">{value || `Add ${field}`}</span>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white p-2 rounded-lg hover:bg-gray-50 shadow-sm hover:shadow-md"
              onClick={() => setEditingField(field)}
            >
              <FaPencilAlt className="text-blue-500 w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
              {icon}
            </div>
            {field === 'bio' ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50 backdrop-blur-sm min-h-[100px] resize-y"
                autoFocus
              />
            ) : (
              <input
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/50 backdrop-blur-sm"
                autoFocus
              />
            )}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                onClick={() => handleSubmit(field, editValue)}
              >
                Save
              </button>
              <button
                className="px-4 py-2 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200"
                onClick={() => setEditingField(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full mb-4 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {tempUsername.charAt(0).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {!editingField || editingField !== 'username' ? (
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
                    setEditingField('username');
                    setTempUsername(formData.username);
                  }}>
                    {formData.username}
                    <FaPencilAlt className="w-4 h-4 opacity-50" />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        handleSubmit('username', tempUsername);
                        setEditingField(null);
                      }}
                      className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30"
                    >
                      Save
                    </button>
                  </div>
                )}
              </h1>
              <p className="text-white/80">Member since {new Date(user.createdAt).getFullYear()}</p>
            </div>
          </div>

          {error && (
            <div className="mx-8 mt-6 bg-red-50/50 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {message && (
            <div className="mx-8 mt-6 bg-green-50/50 backdrop-blur-sm border-l-4 border-green-500 p-4 rounded-xl">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-8 space-y-10">
            <section className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">About</h3>
              <EditableField 
                field="bio" 
                value={formData.bio} 
                icon={<FaUserEdit className="w-5 h-5 text-blue-500" />}
              />
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">Contact Information</h3>
              <div className="space-y-4">
                <EditableField 
                  field="location" 
                  value={formData.location} 
                  icon={<FaMapMarkerAlt className="w-5 h-5 text-blue-500" />}
                />
                <EditableField 
                  field="phoneNumber" 
                  value={formData.phoneNumber} 
                  type="tel"
                  icon={<FaPhone className="w-5 h-5 text-blue-500" />}
                />
              </div>
            </section>

            <section className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6">Social Links</h3>
              <div className="space-y-4">
                <EditableField 
                  field="socialLinks.twitter" 
                  value={formData.socialLinks.twitter}
                  icon={<FaTwitter className="w-5 h-5 text-blue-400" />}
                />
                <EditableField 
                  field="socialLinks.instagram" 
                  value={formData.socialLinks.instagram}
                  icon={<FaInstagram className="w-5 h-5 text-pink-500" />}
                />
                <EditableField 
                  field="socialLinks.facebook" 
                  value={formData.socialLinks.facebook}
                  icon={<FaFacebook className="w-5 h-5 text-blue-600" />}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
