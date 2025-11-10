locals { # are like constants, in this case an object
  vms = {
    "k8s-master" = {
      role         = "master"
      memory_mb    = 4 * 1024
      vcpu         = 2
      disk_size_gb = 20
      ip_address = "192.168.124.2"
    }
    "k8s-worker-1" = {
      role         = "worker"
      memory_mb    = 1024
      vcpu         = 1
      disk_size_gb = 5
      ip_address = "192.168.124.3"
    }
    "k8s-worker-2" = {
      role         = "worker"
      memory_mb    = 1024
      vcpu         = 1
      disk_size_gb = 5
      ip_address = "192.168.124.4"
    }
  }
}
