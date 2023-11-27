<script lang="ts">
  import { trpc } from '$lib/client/trpc'
  import ArrowCircleRightIcon from '~icons/material-symbols/arrow-circle-right'

  const query = trpc.hello.createQuery({ text: 'Elysia' })
</script>

<div class="p-8 max-w-4xl mx-auto">
  <div class="card">
    <header class="card-header text-3xl text-center font-semibold">{$query.data?.greeting}</header>
    <section class="p-4 flex justify-center gap-8">
      <a href="/auth/login" class="btn variant-filled-primary">
        <ArrowCircleRightIcon class="w-6 h-6" />
        <span>Get Started</span>
      </a>
    </section>
    <footer class="card-footer">(footer)</footer>
  </div>
</div>
