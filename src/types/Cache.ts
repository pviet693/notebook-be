export type CacheParams = {
    serviceName: string;
    limit?: number;
    page?: number;
    title?: string;
    categories?: string[];
    username?: string;
    excludeBlogSlug?: string;
    statuses?: string[];
    authors?: string[];
    id?: string;
    slug?: string;
    userId?: string;
    email?: string;
};

export enum CacheServiceName {
    PUBLIC_BLOGS = "public_blogs",
    AUTHOR_BLOGS = "author_blogs",
    PRIVATE_BLOGS = "private_blogs",
    BLOG_DETAILS = "blog_details",
    CATEGORIES = "categories",
    USERS = "users",
    OTP = "otp"
}
