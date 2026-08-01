import path from 'node:path';
import nwbuild from 'nw-builder';

const targets = [
  { platform: 'win', arch: 'x64', outName: 'win64' },
  { platform: 'win', arch: 'ia32', outName: 'win32' },
  { platform: 'win', arch: 'arm64', outName: 'win-arm64' },
  { platform: 'osx', arch: 'x64', outName: 'osx64' },
  { platform: 'osx', arch: 'arm64', outName: 'osx-arm64' },
  { platform: 'linux', arch: 'x64', outName: 'linux64' },
  { platform: 'linux', arch: 'ia32', outName: 'linux32' },
  { platform: 'linux', arch: 'arm64', outName: 'linux-arm64' },
];

async function buildAll() {
  for (const target of targets) {
    const unsupported = target.platform === 'linux' && target.arch === 'ia32';
    if (unsupported) {
      console.warn(`Skipping ${target.outName} because Linux 32-bit builds are not supported by the NW.js download server for this package.`);
      continue;
    }

    console.log(`\nBuilding ${target.outName}...`);
    try {
      await nwbuild({
        srcDir: './src',
        glob: false,
        mode: 'build',
        outDir: path.resolve('./dist', target.outName),
        app: {
          icon: path.resolve('./src/assets/textures/ui/icons/granny.ico'),
          LSApplicationCategoryType: 'public.app-category.games',
          NSHumanReadableCopyright: 'Copyright © 2026 Granny Clicker'
        },
        platform: target.platform,
        arch: target.arch,
      });
    } catch (error) {
      if (target.platform === 'osx') {
        console.warn(`Skipping ${target.outName} because macOS packaging requires symlink support that is not available on this host.`, error.message);
      } else {
        throw error;
      }
    }
  }
}

buildAll()
  .then(() => console.log('Build complete!'))
  .catch((err) => console.error('Build failed:', err));