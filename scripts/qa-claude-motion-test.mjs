#!/usr/bin/env node
// Isolierte FinanzNeo/Claude-Motion-Versuchs-QA. Keine Produktionsfreigabe.
// Setup checks are allowed BEFORE Claude writes a scene; render QA is deliberately fail-closed.
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';

const repo = process.cwd();
const spec = JSON.parse(readFileSync(path.join(repo, 'tests/claude-motion/brief.json'), 'utf8'));
const movie = path.join(repo, spec.output_video);
const out = path.join(repo, spec.output_dir, 'qa');
const assert = (ok, message) => {if (!ok) throw new Error(message);};
const required = (p, minimum=0) => assert(existsSync(p) && statSync(p).size > minimum, 'Missing or too small: ' + p);
const exec = (bin, args) => {
  const result = spawnSync(bin, args, {cwd:repo, encoding:'utf8', maxBuffer:10*1024*1024});
  if (result.error || result.status !== 0) {
    throw new Error(bin + ' ' + args.join(' ') + ' failed: ' + (result.error?.message ?? result.stderr?.slice(-2000) ?? result.status));
  }
  return result.stdout.trim();
};
const checkBasics = () => {
  for(const p of [
    '.claude/agents/finanzneo-motion-director.md',
    '.claude/skills/finanzneo-motion-test/SKILL.md',
    'tests/claude-motion/README.md',
    'tests/claude-motion/brief.json',
    'src/root/ExperimentCompositions.tsx'
  ]) required(path.join(repo,p), 30);
  const agent = readFileSync(path.join(repo,'.claude/agents/finanzneo-motion-director.md'), 'utf8');
  assert(/^model:\s*claude-opus-5-5\s*$/m.test(agent), 'Motion agent is not pinned to claude-opus-5-5');
  assert(Number(process.versions.node.split('.')[0]) >= 20, 'Node 20+ required');
  assert(spec.monthly_cents * spec.months === spec.yearly_cents, 'Brief math is inconsistent');
  assert(spec.width === 1920 && spec.height === 1080 && spec.fps === 30 && spec.duration_frames === 360,
    'Brief unexpectedly changed; expected 1920x1080/30fps/360 frames');
  assert(spec.composition_id === 'ClaudeMotionSubscriptionYearTest', 'Composition ID was changed');
  exec('ffmpeg',['-version']);
  exec('ffprobe',['-version']);
};
const formatFPS = rate => {
  const [n,d] = String(rate || '').split('/').map(Number);
  return n/d;
};

try {
  checkBasics();
  if(process.argv.includes('--setup')) {
    console.log('SETUP OK: test briefing, Opus 5.5 agent, Node, ffmpeg and ffprobe found.');
    console.log('NEXT: run Claude Code /finanzneo-motion-test on a non-main test branch.');
    process.exit(0);
  }

  // Require the actual Claude-authored source and its registered experimental composition.
  const source = path.join(repo,spec.source_file);
  required(source, 100);
  const fileText = readFileSync(source,'utf8');
  assert(fileText.includes(spec.component_export), 'Expected React component export is missing: '+spec.component_export);
  const registry = readFileSync(path.join(repo,spec.composition_registry),'utf8');
  assert(registry.includes(spec.composition_id), 'ExperimentCompositions does not register: '+spec.composition_id);
  assert(!readFileSync(path.join(repo,'src/root/ProductionCompositions.tsx'),'utf8')
    .includes(spec.composition_id), 'TEST composition was inserted in production registry!');
  required(movie, 50_000);
  const metadata = JSON.parse(exec('ffprobe',['-v','error','-show_format','-show_streams','-of','json',movie]));
  const video = metadata.streams.find(s=>s.codec_type === 'video');
  assert(video, 'No video stream in MP4');
  assert(video.width === spec.width && video.height === spec.height, 'Wrong video resolution: '+video.width+'x'+video.height);
  assert(Math.abs(formatFPS(video.avg_frame_rate) - spec.fps) < 0.01, 'Wrong FPS: '+video.avg_frame_rate);
  assert(video.codec_name === 'h264', 'Expected H264, got '+video.codec_name);
  const duration = Number(metadata.format.duration);
  assert(Math.abs(duration - spec.duration_frames/spec.fps) < .12, 'Wrong video duration: '+duration);
  if(video.nb_frames) assert(Math.abs(Number(video.nb_frames)-spec.duration_frames) <= 1,
    'Wrong video frame count: '+video.nb_frames);

  mkdirSync(out,{recursive:true});
  const checks = [];
  for(const percent of spec.checkpoints_percent) {
    const sourceFrame = Math.round((spec.duration_frames - 1) * percent / 100);
    const target = path.join(out,'frame-'+percent+'.png');
    exec('ffmpeg',['-y','-hide_banner','-loglevel','error','-ss',String(sourceFrame/spec.fps),
      '-i',movie,'-frames:v','1','-update','1',target]);
    required(target, 1000);
    checks.push({percent,sourceFrame,path:path.relative(repo,target),
      sha256:createHash('sha256').update(readFileSync(target)).digest('hex')});
  }
  assert(new Set(checks.map(c=>c.sha256)).size === checks.length,
    'At least two checkpoint frames are byte-identical; inspect actual motion and result holds.');
  const contact=path.join(out,'contact.png');
  const args=['-y','-hide_banner','-loglevel','error'];
  checks.forEach(c=>args.push('-i',path.join(repo,c.path)));
  args.push('-filter_complex','[0:v]scale=960:540[a];[1:v]scale=960:540[b];'+
    '[2:v]scale=960:540[c];[3:v]scale=960:540[d];'+
    '[a][b]hstack=inputs=2[top];[c][d]hstack=inputs=2[bottom];[top][bottom]vstack=inputs=2[final]',
    '-map','[final]','-frames:v','1',contact);
  exec('ffmpeg',args);
  required(contact, 1000);
  writeFileSync(path.join(out,'technical-report.json'),JSON.stringify({
    status:'TECHNICAL_QA_PASSED__HUMAN_VISUAL_REVIEW_REQUIRED',
    caution:'This does not certify motion design, readable labels or mathematical graphics.',
    composition:spec.composition_id,source_video:spec.output_video,
    actual_duration_sec:duration,codec:video.codec_name,
    format:spec.width+'x'+spec.height+' '+spec.fps+' fps',
    checks,contact:path.relative(repo,contact)
  },null,2)+'\n');
  console.log('TECHNICAL QA PASS: 1920x1080, 30fps, 12s, H264, 4 different rendered checkpoints.');
  console.log('VISUAL QA STILL REQUIRED: '+path.relative(repo,contact)+' and the full movie.');
} catch(error) {
  console.error('CLAUDE MOTION TEST QA FAIL: '+error.message);
  process.exitCode=1;
}
