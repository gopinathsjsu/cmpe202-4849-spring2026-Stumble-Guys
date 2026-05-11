import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Camera,
  Save,
  ChevronDown,
  ChevronUp,
  Lock,
  User,
  Mail,
  Phone,
  FileText,
  Loader2,
  Shield,
  CalendarPlus,
  Link2,
  Unlink,
} from 'lucide-react';
import useAuthStore from '../store/authStore_Preetam';
import { authApi } from '../api/authApi_Preetam';
import Input from '../components/shared/Input_Preetam';
import Button from '../components/shared/Button_Preetam';
import { useToast } from '../components/shared/Toast_Sasi';
import { cn } from '../utils/cn_Pratham';
import { ROLES } from '../utils/constants_Preetam';
import { integrationsApi } from '../api/integrationsApi_Nikhil';

const ROLE_COLORS: Record<string, string> = {
  [ROLES.ADMIN]: 'bg-red-100 text-red-700',
  [ROLES.ORGANIZER]: 'bg-blue-100 text-blue-700',
  [ROLES.ATTENDEE]: 'bg-green-100 text-green-700',
};

const ProfilePage: React.FC = () => {
  const { user, isLoading, updateProfile, fetchProfile } = useAuthStore();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [bio, setBio] = useState(user?.bio ?? '');

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [gcConfigured, setGcConfigured] = useState(false);
  const [gcLoading, setGcLoading] = useState(false);

  useEffect(() => {
    if (!user) fetchProfile();
  }, [user, fetchProfile]);

  useEffect(() => {
    const status = searchParams.get('google_calendar');
    const rawMsg = searchParams.get('message');
    if (status === 'connected') {
      toast.success('Google Calendar connected');
      fetchProfile();
      searchParams.delete('google_calendar');
      searchParams.delete('message');
      setSearchParams(searchParams, { replace: true });
    } else if (status === 'error') {
      toast.error(rawMsg ? decodeURIComponent(rawMsg) : 'Could not connect Google Calendar');
      searchParams.delete('google_calendar');
      searchParams.delete('message');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast, fetchProfile]);

  useEffect(() => {
    let cancelled = false;
    integrationsApi
      .getGoogleCalendarStatus()
      .then((res) => {
        if (!cancelled) setGcConfigured(res.data?.configured ?? false);
      })
      .catch(() => {
        if (!cancelled) setGcConfigured(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setPhone(user.phone ?? '');
      setBio(user.bio ?? '');
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        bio: bio || undefined,
      });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setChangingPassword(true);
    try {
      await authApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch {
      toast.error('Failed to change password. Check your current password.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      await authApi.uploadAvatar(file);
      await fetchProfile();
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleConnectGoogleCalendar = async () => {
    setGcLoading(true);
    try {
      const res = await integrationsApi.getGoogleCalendarAuthUrl();
      const url = res.data?.authUrl;
      if (url) window.location.href = url;
      else toast.error('Could not start Google sign-in');
    } catch {
      toast.error('Google Calendar is not available');
    } finally {
      setGcLoading(false);
    }
  };

  const handleDisconnectGoogleCalendar = async () => {
    setGcLoading(true);
    try {
      await integrationsApi.disconnectGoogleCalendar();
      await fetchProfile();
      toast.success('Google Calendar disconnected');
    } catch {
      toast.error('Could not disconnect');
    } finally {
      setGcLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-10 flex flex-col items-center gap-6 sm:flex-row">
        {/* Avatar */}
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-400 to-pink-500">
                <span className="text-3xl font-bold text-white">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow transition-colors hover:bg-orange-600 disabled:opacity-50"
          >
            {uploadingAvatar ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">
            {user.first_name} {user.last_name}
          </h1>
          <p className="mt-1 flex items-center justify-center gap-2 text-sm text-gray-500 sm:justify-start">
            <Mail className="h-4 w-4" />
            {user.email}
          </p>
          <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold capitalize',
                ROLE_COLORS[user.role] ?? 'bg-gray-100 text-gray-700'
              )}
            >
              <Shield className="h-3 w-3" />
              {user.role}
            </span>
            {user.is_verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User className="h-5 w-5 text-orange-500" />
            Personal Information
          </h2>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="First Name"
              leftIcon={<User className="h-4 w-4" />}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              leftIcon={<User className="h-4 w-4" />}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mt-5">
            <Input
              label="Phone"
              leftIcon={<Phone className="h-4 w-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-gray-400" />
                Bio
              </span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Tell us a bit about yourself..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>

      {/* Google Calendar */}
      {gcConfigured && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <CalendarPlus className="h-5 w-5 text-orange-500" />
            Google Calendar
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Connect once to add supported events to your primary Google Calendar from EventHub with one
            tap. You can always use &quot;Open in Google Calendar&quot; on an event without connecting.
          </p>
          {user.google_calendar_connected ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                Connected
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                isLoading={gcLoading}
                onClick={handleDisconnectGoogleCalendar}
                className="gap-1.5"
              >
                <Unlink className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="primary"
              isLoading={gcLoading}
              onClick={handleConnectGoogleCalendar}
              className="gap-2"
            >
              <Link2 className="h-4 w-4" />
              Connect Google Calendar
            </Button>
          )}
        </div>
      )}

      {/* Change Password */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setShowPasswordSection(!showPasswordSection)}
          className="flex w-full items-center justify-between p-6"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
          </div>
          {showPasswordSection ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>

        {showPasswordSection && (
          <form onSubmit={handleChangePassword} className="border-t border-gray-100 p-6">
            <div className="space-y-5">
              <Input
                label="Current Password"
                type="password"
                leftIcon={<Lock className="h-4 w-4" />}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="New Password"
                type="password"
                leftIcon={<Lock className="h-4 w-4" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                helperText="Must be at least 6 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                leftIcon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={
                  confirmPassword && newPassword !== confirmPassword
                    ? 'Passwords do not match'
                    : undefined
                }
              />
            </div>
            <div className="mt-6 flex justify-end">
              <Button type="submit" isLoading={changingPassword} variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
