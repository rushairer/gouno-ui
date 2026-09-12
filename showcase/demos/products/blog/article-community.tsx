import { useMemo, useState, type FormEvent } from "react";
import { Heart, MessageCircleReply, ShieldAlert } from "lucide-react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Empty,
  Field,
  Input,
  Modal,
  Textarea,
} from "../../../../src/core";

export type BlogArticleCommunityMode = "signed-in" | "guest" | "empty" | "error";
type CommentFormError = "guest-name" | "content" | null;

type CommunityComment = {
  id: string;
  author: string;
  authorType: "user" | "guest";
  createdAt: string;
  content: string;
  parentId?: string;
};

const initialComments: CommunityComment[] = [
  {
    id: "comment-1",
    author: "Aben",
    authorType: "user",
    createdAt: "2026-09-09 18:12",
    content: "把浏览器和身份协议边界拆开以后，前端的职责确实清楚很多。最重要的是不再为了复用登录态去共享顶级域 Cookie。",
  },
  {
    id: "comment-2",
    author: "小桔",
    authorType: "guest",
    createdAt: "2026-09-09 18:28",
    content: "目录仍然使用真实 hash 这一点很赞，复制链接和键盘操作不会被自定义滚动逻辑破坏。",
    parentId: "comment-1",
  },
  {
    id: "comment-3",
    author: "SpringRoll",
    authorType: "user",
    createdAt: "2026-09-09 19:03",
    content: "希望后面再写一篇真实产品如何反向收敛组件 API 的复盘。",
  },
];

function CommentCard({
  comment,
  canReply,
  onReply,
  onReport,
}: {
  comment: CommunityComment;
  canReply: boolean;
  onReply: (comment: CommunityComment) => void;
  onReport: (comment: CommunityComment) => void;
}) {
  return (
    <Card id={`comment-${comment.id}`} padding="sm" className="gap-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <strong className="text-sm text-foreground">{comment.author}</strong>
        <Badge
          status={comment.authorType === "user" ? "success" : "default"}
          text={comment.authorType === "user" ? "已登录" : "访客"}
          className="text-xs"
        />
        <span>{comment.createdAt}</span>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{comment.content}</p>
      <div className="flex flex-wrap gap-1">
        {canReply ? (
          <Button
            variant="text"
            size="small"
            icon={<MessageCircleReply />}
            onClick={() => onReply(comment)}
          >
            回复
          </Button>
        ) : null}
        <Button
          variant="text"
          color="warning"
          size="small"
          icon={<ShieldAlert />}
          onClick={() => onReport(comment)}
        >
          举报
        </Button>
      </div>
    </Card>
  );
}

export function BlogArticleCommunity({
  mode = "signed-in",
}: {
  mode?: BlogArticleCommunityMode;
}) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(96);
  const [createdComments, setCreatedComments] = useState<CommunityComment[]>([]);
  const [replyingTo, setReplyingTo] = useState<CommunityComment | null>(null);
  const [reportingComment, setReportingComment] = useState<CommunityComment | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [formError, setFormError] = useState<CommentFormError>(null);
  const [notice, setNotice] = useState("");

  const visibleComments = useMemo(
    () => (mode === "empty" ? createdComments : [...initialComments, ...createdComments]),
    [createdComments, mode],
  );
  const roots = useMemo(
    () => visibleComments.filter((comment) => !comment.parentId),
    [visibleComments],
  );
  const repliesByParent = useMemo(() => {
    const map = new Map<string, CommunityComment[]>();
    for (const comment of visibleComments) {
      if (!comment.parentId) continue;
      const current = map.get(comment.parentId) ?? [];
      current.push(comment);
      map.set(comment.parentId, current);
    }
    return map;
  }, [visibleComments]);

  const toggleLike = () => {
    setLiked((current) => {
      setLikes((count) => count + (current ? -1 : 1));
      return !current;
    });
  };

  const beginReply = (comment: CommunityComment) => {
    setReplyingTo(comment);
    setFormError(null);
    setNotice("");
  };

  const submitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const author = mode === "guest" ? guestName.trim() : "Paw";
    const content = commentContent.trim();

    if (!author) {
      setFormError("guest-name");
      return;
    }
    if (!content) {
      setFormError("content");
      return;
    }

    const next: CommunityComment = {
      id: `fixture-${createdComments.length + 1}`,
      author,
      authorType: mode === "guest" ? "guest" : "user",
      createdAt: "刚刚",
      content,
      parentId: replyingTo?.id,
    };

    setCreatedComments((current) => [...current, next]);
    setCommentContent("");
    setFormError(null);
    setNotice(replyingTo ? `已回复 ${replyingTo.author}。` : "评论已发布。" );
    setReplyingTo(null);
  };

  const openReport = (comment: CommunityComment) => {
    setReportingComment(comment);
    setReportReason("");
    setReportError(false);
    setNotice("");
  };

  const closeReport = () => {
    setReportingComment(null);
    setReportReason("");
    setReportError(false);
  };

  const submitReport = () => {
    if (!reportReason.trim()) {
      setReportError(true);
      return;
    }
    const author = reportingComment?.author ?? "该评论";
    closeReport();
    setNotice(`已提交对 ${author} 的举报。`);
  };

  return (
    <section aria-labelledby="article-community" className="mx-auto mt-12 w-full max-w-[900px] space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4">
        <div>
          <h2 id="article-community" className="text-xl font-semibold tracking-tight">讨论</h2>
          <p className="mt-1 text-sm text-muted-foreground">围绕文章内容继续交流；回复只保留一层，举报流程保持独立。</p>
        </div>
        <Button
          variant={liked ? "solid" : "outline"}
          color={liked ? "primary" : "default"}
          icon={<Heart fill={liked ? "currentColor" : "none"} />}
          aria-pressed={liked}
          onClick={toggleLike}
        >
          {likes} likes
        </Button>
      </div>

      {mode === "error" ? (
        <Alert
          type="error"
          title="评论交互暂时不可用"
          description="静态 Fixture 模拟评论接口失败；文章阅读本身不受影响。"
          showIcon
        />
      ) : null}
      {notice ? <Alert type="success" description={notice} showIcon /> : null}

      <div className="space-y-4" aria-label="评论列表">
        {roots.length === 0 ? (
          <Empty title="还没有评论" description="成为第一个参与讨论的人。" />
        ) : (
          roots.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentCard
                comment={comment}
                canReply
                onReply={beginReply}
                onReport={openReport}
              />
              {(repliesByParent.get(comment.id) ?? []).length > 0 ? (
                <div className="ml-4 space-y-3 border-l pl-4 sm:ml-8">
                  {(repliesByParent.get(comment.id) ?? []).map((reply) => (
                    <CommentCard
                      key={reply.id}
                      comment={reply}
                      canReply={false}
                      onReply={beginReply}
                      onReport={openReport}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>

      <Card as="section" variant="subtle" aria-labelledby="comment-form-title">
        <div>
          <h3 id="comment-form-title" className="text-base font-semibold">留下评论</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "guest" ? "访客留言需要填写昵称。" : "当前以 Paw 身份参与讨论。"}
          </p>
        </div>

        {replyingTo ? (
          <Alert
            type="info"
            title={`正在回复 ${replyingTo.author}`}
            description="回复会显示在该根评论下方。"
            action={<Button variant="text" size="small" onClick={() => setReplyingTo(null)}>取消回复</Button>}
          />
        ) : null}

        <form className="space-y-4" onSubmit={submitComment} noValidate>
          {mode === "guest" ? (
            <Field label="昵称" required error={formError === "guest-name" ? "请输入昵称。" : undefined}>
              <Input
                value={guestName}
                onChange={(event) => {
                  setGuestName(event.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="怎么称呼你"
              />
            </Field>
          ) : null}
          <Field
            label={replyingTo ? "回复内容" : "评论内容"}
            required
            error={formError === "content" ? "请输入评论内容。" : undefined}
          >
            <Textarea
              rows={5}
              value={commentContent}
              onChange={(event) => {
                setCommentContent(event.target.value);
                if (formError) setFormError(null);
              }}
              placeholder={replyingTo ? `回复 ${replyingTo.author}…` : "写下你的想法…"}
            />
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground">Showcase 只修改本地 Fixture，不会提交真实评论。</span>
            <Button type="submit" variant="solid" color="primary">
              {replyingTo ? "发布回复" : "发布评论"}
            </Button>
          </div>
        </form>
      </Card>

      <Modal
        open={Boolean(reportingComment)}
        title="举报评论"
        description={reportingComment ? `举报 ${reportingComment.author} 的评论。` : undefined}
        onOpenChange={(open) => {
          if (!open) closeReport();
        }}
        onOk={submitReport}
        onCancel={closeReport}
        okText="提交举报"
        okButtonProps={{ color: "error" }}
        cancelText="取消"
      >
        <Field label="举报原因" required error={reportError ? "请填写举报原因。" : undefined}>
          <Textarea
            rows={4}
            value={reportReason}
            onChange={(event) => {
              setReportReason(event.target.value);
              if (reportError) setReportError(false);
            }}
            placeholder="请说明这条评论存在的问题"
          />
        </Field>
      </Modal>
    </section>
  );
}
