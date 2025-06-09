import NextChat from './NextChat';

export default function NextChatPage() {
  // You may want to get recruiterId and userId from auth context or redux
  // For demo, use dummy values or fetch from store
  const recruiterId = 'RECRUITER_ID_FROM_AUTH';
  const userId = 'USER_ID_FROM_AUTH';
  return <NextChat recruiterId={recruiterId} userId={userId} />;
}
