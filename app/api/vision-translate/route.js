
export const runtime='nodejs';

function demoResult(){return {demo:true,translation:['[Demo overlay vì chưa cấu hình OPENAI_API_KEY]','Cậu đang làm cái quái gì ở đây vậy?!','Hiệu ứng: ẦM!'].join('\n'),overlays:[{type:'bubble',x:18,y:58,w:64,h:14,text:'Cậu đang làm cái quái gì ở đây vậy?!',fontSize:'clamp(12px,2.2vw,24px)'},{type:'sfx',x:34,y:78,w:32,h:9,text:'ẦM!',fontSize:'clamp(18px,3vw,34px)'}]}}

function extractJson(text){const cleaned=(text||'').trim().replace(/^```json/i,'').replace(/^```/,'').replace(/```$/,'').trim();try{return JSON.parse(cleaned)}catch(e){const m=cleaned.match(/\{[\s\S]*\}/);if(m)return JSON.parse(m[0]);throw e}}

export async function POST(req){
 try{
  const {image,fileName,style}=await req.json();
  if(!image)return Response.json({error:'Thiếu ảnh'}, {status:400});
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey)return Response.json(demoResult());
  const model=process.env.OPENAI_MODEL||'gpt-4o-mini';
  const styleGuide={literal:'dịch sát nghĩa, không phóng tác',vietnameseStreet:'dịch tự nhiên, dân dã Việt Nam, giữ sắc thái câu chửi vừa phải nếu bản gốc có',manga:'dịch ngắn gọn, hợp bóng thoại truyện tranh',harshSafe:'giữ độ gắt có kiểm soát, không thêm miệt thị nhóm người thật'}[style]||'dịch tự nhiên, dân dã Việt Nam';
  const prompt=`Bạn là công cụ OCR và biên dịch truyện tranh sang tiếng Việt. Hãy đọc chữ trong ảnh, dịch sang tiếng Việt. Trả về DUY NHẤT JSON hợp lệ với schema: {"translation":"toàn bộ bản dịch text", "overlays":[{"type":"bubble|sfx","x":number,"y":number,"w":number,"h":number,"text":"bản dịch tiếng Việt ngắn gọn","fontSize":"clamp(12px,2vw,22px)"}]}. Tọa độ x,y,w,h là phần trăm theo kích thước ảnh, đặt đúng lên vùng chữ gốc. Phong cách: ${styleGuide}. Không thêm giải thích ngoài JSON.`;
  const resp=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model,messages:[{role:'user',content:[{type:'text',text:prompt},{type:'image_url',image_url:{url:image,detail:'high'}}]}],temperature:0.2,response_format:{type:'json_object'},max_tokens:2200})});
  const data=await resp.json();
  if(!resp.ok)return Response.json({error:data?.error?.message||'OpenAI API lỗi'}, {status:500});
  const content=data?.choices?.[0]?.message?.content||'';
  const parsed=extractJson(content);
  const overlays=Array.isArray(parsed.overlays)?parsed.overlays.map(o=>({type:o.type==='sfx'?'sfx':'bubble',x:Number(o.x)||10,y:Number(o.y)||10,w:Number(o.w)||50,h:Number(o.h)||10,text:String(o.text||''),fontSize:o.fontSize||'clamp(12px,2vw,22px)'})):[];
  return Response.json({demo:false,translation:String(parsed.translation||''),overlays});
 }catch(e){return Response.json({error:e.message||'Lỗi xử lý'}, {status:500})}
}
