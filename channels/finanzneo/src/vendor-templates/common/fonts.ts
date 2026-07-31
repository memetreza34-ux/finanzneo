/**
 * Font family for legacy vendor templates.
 *
 * The studio loads Inter locally via @studio/core. Avoid @remotion/google-fonts
 * here so old demo templates cannot block unrelated renders on network timeouts.
 */
export const font = 'Inter';
