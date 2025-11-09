/*output "ips" {
  value = { # for functions maps the key and the resource
   # the outupt will be "domain": "ip"
    for key, vm in local.vms : 
      data.libvirt_domain_interface_addresses.ips[key].domain => data.libvirt_domain_interface_addresses.ips[key].interfaces[0].addrs[0].addr
  }
  description = "Map of VM keys to their IPs"
}*/