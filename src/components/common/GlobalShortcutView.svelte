<script lang="ts">
  type ShortcupMap = {
    [key: string]: string
  }

  const shortcutMap: ShortcupMap = {
    esc: 'Navigate to home screen',
    n: 'Create new preset',
    e: 'Edit selected preset',
    c: 'Navigate to connection screen',
    p: 'Navigate to presets screen',
    'left/up': 'Previous preset',
    'right/down': 'Next preset',
    shift: 'View keyboard shortcuts menu',
  }
</script>

<div class="flex flex-col justify-center gap-4 absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-900/70 p-20">
  {#each Object.keys(shortcutMap) as key}
    <div class="flex gap-4 items-center justify-start">
      <kbd class="px-2 py-1.5 text-xs font-semibold text-slate-900 bg-gray-100 border border-gray-200 rounded-lg">{key}</kbd><span class="flex gap-4 text-gray-100 font-mono">-
      <p class="justify-self-end">{shortcutMap[key]}</p></span>
    </div>
  {/each}
</div>
