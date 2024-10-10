import Link from 'next/link';

const PostButton = () => {
  return (
    <Link href="/publishListing">
      <button
        className="bg-black text-white px-10 py-3 rounded text-xs font-semibold"
      >
        Post Ad
      </button>
    </Link>
  );
};

export default PostButton;
