"""
Admin seeding utility.

Usage
-----
Promote an existing user to admin:
    python make_admin.py promote <email>

Create a brand-new admin user (if one doesn't exist yet):
    python make_admin.py create <email> <full_name> <password>

List all current admin users:
    python make_admin.py list
"""

import asyncio
import sys
import os
import uuid

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import select, update
from app.database import AsyncSessionLocal
from app.models.user import User
from app.utils.security import hash_password


async def promote(email: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            print(f"[ERROR] No user found with email: {email}")
            sys.exit(1)
        if user.role == "admin":
            print(f"[INFO] {email} is already an admin.")
            return
        await db.execute(update(User).where(User.email == email).values(role="admin"))
        await db.commit()
        print(f"[OK] {email} has been promoted to admin.")


async def create(email: str, full_name: str, password: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email))
        existing = result.scalar_one_or_none()
        if existing:
            if existing.role == "admin":
                print(f"[INFO] {email} already exists and is already an admin.")
            else:
                await db.execute(
                    update(User).where(User.email == email).values(role="admin")
                )
                await db.commit()
                print(f"[OK] {email} already existed — promoted to admin.")
            return

        new_user = User(
            id=str(uuid.uuid4()),
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role="admin",
            is_active=True,
        )
        db.add(new_user)
        await db.commit()
        print(f"[OK] Admin user '{full_name}' ({email}) created successfully.")


async def list_admins() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.role == "admin"))
        admins = result.scalars().all()
        if not admins:
            print("[INFO] No admin users found.")
            return
        print(f"{'Email':<35} {'Full Name':<25} {'Active'}")
        print("-" * 65)
        for u in admins:
            print(f"{u.email:<35} {u.full_name:<25} {u.is_active}")


def usage() -> None:
    print(__doc__)
    sys.exit(1)


if __name__ == "__main__":
    args = sys.argv[1:]

    if not args:
        usage()

    command = args[0]

    if command == "promote":
        if len(args) != 2:
            print("Usage: python make_admin.py promote <email>")
            sys.exit(1)
        asyncio.run(promote(args[1]))

    elif command == "create":
        if len(args) != 4:
            print("Usage: python make_admin.py create <email> <full_name> <password>")
            sys.exit(1)
        asyncio.run(create(args[1], args[2], args[3]))

    elif command == "list":
        asyncio.run(list_admins())

    else:
        usage()
