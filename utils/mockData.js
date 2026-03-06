// Mock data for testing without MongoDB
let roles = [
    {
        _id: "role001",
        name: "Admin",
        description: "Administrator with full access",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01")
    },
    {
        _id: "role002",
        name: "User",
        description: "Regular user",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01")
    },
    {
        _id: "role003",
        name: "Manager",
        description: "Manager role",
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01")
    }
];

let users = [
    {
        _id: "user001",
        username: "admin",
        password: "admin123",
        email: "admin@example.com",
        fullName: "Administrator",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        status: true,
        role: "role001",
        loginCount: 10,
        isDeleted: false,
        createdAt: new Date("2026-01-01"),
        updatedAt: new Date("2026-01-01")
    },
    {
        _id: "user002",
        username: "john_doe",
        password: "pass123",
        email: "john@example.com",
        fullName: "John Doe",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
        status: true,
        role: "role002",
        loginCount: 5,
        isDeleted: false,
        createdAt: new Date("2026-01-15"),
        updatedAt: new Date("2026-01-15")
    },
    {
        _id: "user003",
        username: "jane_smith",
        password: "pass456",
        email: "jane@example.com",
        fullName: "Jane Smith",
        avatarUrl: "https://i.pravatar.cc/150?img=47",
        status: false,
        role: "role003",
        loginCount: 3,
        isDeleted: false,
        createdAt: new Date("2026-01-20"),
        updatedAt: new Date("2026-01-20")
    }
];

let idCounter = {
    role: 4,
    user: 4
};

module.exports = {
    roles,
    users,
    idCounter
};
