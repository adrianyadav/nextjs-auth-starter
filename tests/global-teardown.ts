import { execSync } from 'child_process';

async function globalTeardown() {
    console.log('🧹 Running global teardown - cleaning up test outfits...');

    try {
        // Run the cleanup command
        execSync('npm run db:cleanup:outfits', {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        console.log('✅ Test outfits cleanup completed successfully');
    } catch (error) {
        console.error('❌ Error during test outfits cleanup:', error);
        // Don't throw the error to avoid failing the test run due to cleanup issues
    }
}

export default globalTeardown; 