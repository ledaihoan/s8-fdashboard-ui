module.exports = {
    apps: [
        {
            name: 's8-fd-ui',
            exec_mode: 'cluster',
            script: './node_modules/next/dist/bin/next',
            args: 'start',
            instances: 2, //"max",
            kill_timeout: 4000,
            wait_ready: true,
            auto_restart: true,
            watch: false,
            max_memory_restart: '1536M',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            node_args: '--max-old-space-size=2048',
        }
    ]
}