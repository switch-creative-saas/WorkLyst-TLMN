import { useMemo, useState } from 'react';
import { Calendar, Edit, Eye, Plus, Search, Tag, Trash2, User } from 'lucide-react';
import { toast } from 'sonner';
import { ModulePage } from '@/components/layout/ModulePage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAnnouncementsStore, type AnnouncementRecord } from '@/stores/useAnnouncementsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'EXPIRED';

interface NewsPost {
  id: string;
  title: string;
  summary: string;
  body: string;
  coverImageUrl: string | null;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  status: NewsStatus;
  createdAt: string;
}

function statusFor(item: AnnouncementRecord): NewsStatus {
  const now = Date.now();
  if (item.expiryDate && new Date(item.expiryDate).getTime() < now) return 'EXPIRED';
  if (item.publishDate && new Date(item.publishDate).getTime() > now) return 'SCHEDULED';
  return 'PUBLISHED';
}

function toNewsPost(item: AnnouncementRecord): NewsPost {
  const body = item.body ?? '';
  const firstParagraph = body.split('\n').find(Boolean) ?? body;
  return {
    id: item.id,
    title: item.title ?? 'Untitled news post',
    summary: firstParagraph.slice(0, 140),
    body,
    coverImageUrl: item.thumbnail ?? null,
    category: item.type === 'News' ? 'Organizational News' : item.type ?? 'Organizational News',
    tags: item.pinned ? ['Pinned'] : [],
    author: item.createdByName ?? 'Communications',
    publishDate: item.publishDate ?? item.createdAt ?? new Date().toISOString(),
    status: statusFor(item),
    createdAt: item.createdAt ?? new Date().toISOString(),
  };
}

const isNewsAnnouncement = (item: AnnouncementRecord) => String(item.type).toLowerCase() === 'news';

function statusBadge(status: NewsStatus) {
  const map: Record<NewsStatus, string> = {
    PUBLISHED: 'bg-[#247833]/10 text-[#247833]',
    DRAFT: 'bg-gray-100 text-gray-600',
    SCHEDULED: 'bg-[#00578A]/10 text-[#00578A]',
    EXPIRED: 'bg-[#E1332A]/10 text-[#E1332A]',
  };
  return map[status];
}

function prettyStatus(status: NewsStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button type="button" className="text-sm text-gray-500 hover:text-gray-900" onClick={onClose}>
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NewsPostForm({ onDone }: { onDone: () => void }) {
  const user = useAuthStore((state) => state.user);
  const createAnnouncement = useAnnouncementsStore((state) => state.createAnnouncement);
  const [form, setForm] = useState({
    headline: '',
    summary: '',
    body: '',
    category: 'Organizational News',
    tags: '',
    coverImageUrl: '',
    publishDate: new Date().toISOString().slice(0, 16),
    saveMode: 'PUBLISHED' as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED',
  });

  const submit = () => {
    if (!form.headline.trim()) return toast.error('Headline is required');
    if (!form.body.trim()) return toast.error('Article body is required');

    const created = createAnnouncement(
      {
        title: form.headline.trim(),
        type: 'News',
        body: `${form.summary.trim()}\n\n${form.body.trim()}`.trim(),
        thumbnail: form.coverImageUrl.trim() || undefined,
        visibility: 'All Staff',
        pinned: false,
        publishDate:
          form.saveMode === 'DRAFT'
            ? new Date('2099-01-01T00:00:00').toISOString()
            : new Date(form.publishDate).toISOString(),
      },
      user
    );

    if (!created) {
      toast.error('Only Communications, Reception, HR, or Admin users can publish news.');
      return;
    }

    toast.success(form.saveMode === 'DRAFT' ? 'News post saved as draft' : 'News post published');
    onDone();
  };

  return (
    <div className="grid gap-4">
      <Input placeholder="Headline" value={form.headline} onChange={(event) => setForm({ ...form, headline: event.target.value })} />
      <Textarea placeholder="Summary shown in dashboard previews" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
      <Textarea placeholder="Full article body" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="min-h-36" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="h-10 w-full rounded-md border px-3 text-sm">
          {['Organizational News', 'Program Update', 'Partnership', 'Achievement', 'External News'].map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <Input placeholder="Tags, comma separated" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} />
      </div>
      <Input placeholder="Cover image URL" value={form.coverImageUrl} onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value })} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input type="datetime-local" value={form.publishDate} onChange={(event) => setForm({ ...form, publishDate: event.target.value })} />
        <select value={form.saveMode} onChange={(event) => setForm({ ...form, saveMode: event.target.value as typeof form.saveMode })} className="h-10 w-full rounded-md border px-3 text-sm">
          <option value="PUBLISHED">Publish Now</option>
          <option value="SCHEDULED">Schedule</option>
          <option value="DRAFT">Save as Draft</option>
        </select>
      </div>
      <Button type="button" className="bg-[#82154F] text-white" onClick={submit}>
        Save News Post
      </Button>
    </div>
  );
}

export function NewsPostsPage() {
  const announcements = useAnnouncementsStore((state) => state.announcements);
  const deleteAnnouncement = useAnnouncementsStore((state) => state.deleteAnnouncement);
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | NewsStatus>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsPost | null>(null);

  const posts = useMemo(
    () => announcements.filter(isNewsAnnouncement).map(toNewsPost),
    [announcements]
  );

  const filtered = posts.filter((post) => {
    const matchSearch = [post.title, post.summary, post.author, post.category]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || post.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const removePost = (post: NewsPost) => {
    const ok = deleteAnnouncement(post.id, user.role);
    if (ok) toast.success('News post deleted');
    else toast.error('You do not have permission to delete news posts');
  };

  return (
    <ModulePage
      title="News Posts"
      breadcrumbs={[{ label: 'Communications' }, { label: 'News Posts' }]}
      actions={
        <Button onClick={() => setShowCreateModal(true)} className="bg-[#82154F] text-white hover:bg-[#82154F]/90">
          <Plus className="h-4 w-4" /> New Post
        </Button>
      }
    >
      <div className="w-full max-w-full space-y-6 overflow-hidden">
        <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">News Posts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage organization news visible to staff dashboards.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search posts..."
                  className="pl-9"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
                className="h-10 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#82154F]/20"
              >
                <option value="ALL">All Status</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>
        </section>

        <div className="w-full overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full min-w-[780px]">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {['Title', 'Category', 'Author', 'Published', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="h-8 w-8 opacity-30" />
                      <p className="text-sm">No news posts found</p>
                      <button type="button" onClick={() => setShowCreateModal(true)} className="mt-1 text-sm text-[#82154F] underline">
                        Create your first post
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="max-w-[240px] truncate text-sm font-medium text-gray-900">{post.title}</p>
                      <p className="mt-0.5 max-w-[240px] truncate text-xs text-gray-400">{post.summary}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{post.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(post.publishDate).toLocaleDateString('en-NG', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('rounded-full px-2 py-1 text-xs font-medium', statusBadge(post.status))}>
                        {prettyStatus(post.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button type="button" className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700" title="View" onClick={() => setSelectedPost(post)}>
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-blue-50 hover:text-blue-600" title="Edit" onClick={() => toast.info('Edit form coming next')}>
                          <Edit className="h-4 w-4" />
                        </button>
                        <button type="button" className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete" onClick={() => removePost(post)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {posts.length} posts
          </p>
        )}
      </div>

      {showCreateModal && (
        <Modal title="Create News Post" onClose={() => setShowCreateModal(false)}>
          <NewsPostForm onDone={() => setShowCreateModal(false)} />
        </Modal>
      )}

      {selectedPost && (
        <Modal title={selectedPost.title} onClose={() => setSelectedPost(null)}>
          <div className="space-y-4">
            {selectedPost.coverImageUrl && (
              <img src={selectedPost.coverImageUrl} alt="" className="h-48 w-full rounded-lg object-cover" />
            )}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{selectedPost.category}</span>
              <span className={cn('rounded-full px-2 py-1 text-xs font-medium', statusBadge(selectedPost.status))}>
                {prettyStatus(selectedPost.status)}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              By {selectedPost.author} · {new Date(selectedPost.publishDate).toLocaleString()}
            </p>
            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">{selectedPost.body}</p>
          </div>
        </Modal>
      )}
    </ModulePage>
  );
}

export default NewsPostsPage;
