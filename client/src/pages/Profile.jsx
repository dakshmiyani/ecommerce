import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";


const Profile = () => {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const { userId } = useParams();
  const user = useSelector((state) => state.user?.User);
const [loading, setLoading] = useState(false);

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    zipcode: "",
    address: "",
    city: "",
    state: "",
    profilePic: "",
    role: "",
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUpdateUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        zipcode: user.zipcode || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        profilePic: user.profilePic || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUpdateUser((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(selectedFile),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     setLoading(true);  
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      toast.error("Not authenticated. Please log in again.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("zipcode", updateUser.zipcode);
      formData.append("address", updateUser.address);
      formData.append("email", updateUser.email);
      formData.append("city", updateUser.city);
      formData.append("state", updateUser.state);
      formData.append("role", updateUser.role || "");

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(`${baseURL}/users/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        dispatch(setUser(res.data.user));
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.error("Profile update failed:", error.response || error);
      toast.error(
        error.response?.data?.message ||
          "Profile update failed. Please try again."
      );
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-50 min-h-screen bg-gray-100 flex items-start justify-center">
      <div className="w-full max-w-6xl px-4">
        <Tabs defaultValue="profile">
          <div className="mb-6">
            <TabsList className="mx-auto md:mx-0">
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>
          </div>

          {/* PROFILE TAB ONLY */}
          <TabsContent value="profile">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
              Update Profile
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Profile Picture */}
              <div className="flex flex-col items-center md:items-start">
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-800">
                  <img
                    src={updateUser?.profilePic || "/default-profile.png"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <label className="mt-4 inline-flex items-center gap-2 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                <p className="text-sm text-gray-500 mt-4 max-w-xs">
                  Recommended: 400x400px. JPG or PNG. Keep image square.
                </p>
              </div>

              {/* Profile Form */}
              <div className="md:col-span-2">
                <form
                  className="space-y-6 bg-white p-6 rounded-lg shadow"
                  onSubmit={handleSubmit}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={updateUser.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={updateUser.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={updateUser.email}
                      disabled
                      className="bg-gray-50 text-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phoneNo">Phone No</Label>
                      <Input
                        type="text"
                        id="phoneNo"
                        name="phoneNo"
                        value={updateUser.phoneNo}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipcode">Zipcode</Label>
                      <Input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={updateUser.zipcode}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      type="text"
                      id="address"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        type="text"
                        id="city"
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        type="text"
                        id="state"
                        name="state"
                        value={updateUser.state}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                 <div className="flex justify-end gap-4">
  <Button
    type="button"
    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold"
   onClick={() => navigate(`/reset-password`,
    { state: { email: updateUser.email } }

   )}
  >
    Change Password
  </Button>

  <Button
  type="submit"
  disabled={loading}
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2"
>
  {loading ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Updating...
    </>
  ) : (
    "Update Profile"
  )}
</Button>
</div>

                </form>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
