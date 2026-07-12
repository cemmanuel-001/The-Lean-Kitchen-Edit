import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-6">New Post</h1>
      <PostEditor mode="create" />
    </div>
  );
}
