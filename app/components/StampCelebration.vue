<script setup lang="ts">
const props = defineProps<{ flag: string; name: string; color: string }>()
const emit = defineEmits<{ close: [] }>()
const pieces = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  delay: `${(i % 9) * 0.07}s`,
  hue: (i * 47) % 360,
  rot: `${(i * 53) % 360}deg`,
}))
onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/60 p-8 backdrop-blur-sm" role="dialog" aria-modal="true" @click="emit('close')">
    <span
      v-for="(p, i) in pieces"
      :key="i"
      class="confetti absolute top-0 h-3 w-2 rounded-sm"
      :style="{ left: p.left, animationDelay: p.delay, background: `hsl(${p.hue} 85% 60%)`, rotate: p.rot }"
      aria-hidden="true"
    />
    <div class="stamp flex aspect-square w-64 flex-col items-center justify-center rounded-full border-8 border-double bg-card text-center" :style="{ borderColor: props.color, color: props.color }">
      <span class="text-6xl" aria-hidden="true">{{ flag }}</span>
      <span class="mt-2 font-display text-2xl font-bold uppercase">{{ name }}</span>
      <span class="mt-1 text-xs font-bold tracking-[0.3em]">ВІЗУ ОТРИМАНО</span>
    </div>
  </div>
</template>

<style scoped>
.stamp {
  animation: stamp 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both;
}
@keyframes stamp {
  from { transform: scale(2.4) rotate(-20deg); opacity: 0; }
  to { transform: scale(1) rotate(-8deg); opacity: 1; }
}
.confetti {
  animation: fall 1.8s ease-in forwards;
}
@keyframes fall {
  from { transform: translateY(-20px); opacity: 1; }
  to { transform: translateY(100vh) rotate(540deg); opacity: 0; }
}
</style>
