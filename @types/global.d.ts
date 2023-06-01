type OtpPurpose =
  | "EMAIL_VERIFICATION"
  | "LOGIN"
  | "RESET_PASSWORD"
  | "PHONE_VERIFICATION";
type Roles = "USER" | "ADMIN" | "ADMIN_STAFF";
interface TokenPayload {
  role: Roles;
  _id: string;
  adminpermission?: Admin_permissions;
  username: string;
  email: string;
  phoneNumber: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  isDeleted: boolean;
  createdAt: Date;
  purpose?: OtpPurpose;
}

type Gender = "Male" | "Female" | "Other";
