locals {
  vms = {
    "nfs-server" = {
      role = "server"
      memory_mb = 2 * 1024 
      vcpu = 2
      disk_size_gb = 20
    }
    "nfs-client-1" = {
      role = "client"
      memory_mb = 1024
      vcpu = 1
      disk_size_gb = 5
    }
     "nfs-client-2" = {
      role = "client"
      memory_mb = 1024
      vcpu = 1
      disk_size_gb = 5
    }
  }
}
