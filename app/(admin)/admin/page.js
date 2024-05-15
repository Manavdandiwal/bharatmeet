"use client";

import Loader from "@/components/Loader";
import axios from "axios";
import { useEffect, useState } from "react";
import UserCard from "@/components/UserCard";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import AddUserModal from "@/components/AddUser";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addUser, setAddUser] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        const getUsers = async () => {
            const {
                data: { users, success },
            } = await axios.get("/api/getUsers");
            if (!success) {
                toast({
                    title: data.err || "Something went wrong",
                });
                return;
            }
            setUsers(users);
            setLoading(false);
        };
        getUsers();
    }, []);

    if (loading) return <Loader />;
    return (
        <section className="flex size-full flex-col gap-10 text-white">
            <Button
                onClick={() => {
                    setAddUser(true);
                }}
            >
                Add New User
            </Button>
            <AddUserModal
                isOpen={addUser}
                onClose={() => {
                    setNewUser({ name: "", email: "", role: "" });
                    setAddUser(false);
                }}
                title="Add new user"
                className=""
                buttonText="Add User"
                handleClick={async () => {
                    if (!newUser.name) {
                        toast({
                            title: "Name cannot be empty",
                        });
                        return;
                    }
                    if (!newUser.email) {
                        toast({
                            title: "Email cannot be empty",
                        });
                        return;
                    }
                    if (!newUser.role) {
                        toast({
                            title: "Role cannot be empty",
                        });
                        return;
                    }
                    const res = await axios.post("/api/addUser", {
                        user: newUser,
                    });
                    if (res.data?.success) {
                        toast({
                            title: "User added successfully",
                        });
                        setUsers([...users, res.data.user]);
                        setNewUser({ name: "", email: "", role: "" });
                    } else {
                        toast({
                            title: "Something went wrong, please try again",
                        });
                    }
                    setAddUser(false);
                }}
            >
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">
                        Name
                    </label>
                    <Input
                        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onChange={(e) => {
                            setNewUser({
                                ...newUser,
                                name: e.target.value,
                            });
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">
                        Email
                    </label>
                    <Input
                        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                        type="email"
                        onChange={(e) => {
                            setNewUser({
                                ...newUser,
                                email: e.target.value,
                            });
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label className="text-base text-normal leading-[22px] text-sky-2">
                        Role
                    </label>
                    <Select
                        onValueChange={(e) => {
                            setNewUser({ ...newUser, role: e });
                        }}
                    >
                        <SelectTrigger className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 w-[180px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent className="border-none text-white bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0">
                            <SelectItem className="cursor-pointer" value="user">
                                User
                            </SelectItem>
                            <SelectItem
                                className="cursor-pointer"
                                value="admin"
                            >
                                Admin
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </AddUserModal>
            <div className="grid grid-cols-3 gap-5">
                {users.map((user, index) => {
                    return (
                        <UserCard
                            user={user}
                            key={index}
                            handleClick={async () => {
                                const {
                                    data: { success },
                                } = await axios.post("/api/removeUser", {
                                    user,
                                });
                                if (!success) {
                                    toast({
                                        title: "Something went wrong, try again later",
                                    });
                                    return;
                                } else {
                                    toast({
                                        title: "User deleted successfully",
                                    });
                                    setUsers((prev) => {
                                        const data = prev.filter(
                                            (a) => a != user
                                        );
                                        return data;
                                    });
                                }
                                return success;
                            }}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default Admin;
