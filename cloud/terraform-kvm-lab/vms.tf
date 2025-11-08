
resource "libvirt_volume" "vm_disk" { # the overlay (backed) image
  for_each = local.vms
  name     = "${each.key}-disk.qcow2" # the name saved
  format   = "qcow2"                  # the format to save
  pool     = var.storage_pool
  capacity = each.value.disk_size_gb * 1024 * 1024 * 1024 # 20GB em bytes

  backing_store = {
    path   = libvirt_volume.ubuntu_base.path # the path for the backing image
    format = "qcow2"                         # the format to read
  }
}

resource "libvirt_cloudinit_disk" "init" { # create the "cd room"
  for_each = local.vms
  name     = "${each.key}-init"
  user_data = templatefile("${path.module}/cloud-init/${each.value.role}-user-data.yaml.tpl", {
    hostname = each.key
    ssh_key  = var.ssh_public_key
  })
  meta_data = templatefile("${path.module}/cloud-init/meta-data.yaml.tpl", {
    hostname = each.key
  })
}

resource "libvirt_volume" "cloudinit_disk" {
  for_each = local.vms
  name     = "${each.key}-init.iso"
  pool     = var.storage_pool
  create = {
    content = {
      url = libvirt_cloudinit_disk.init[each.key].path
    }
  }
}


resource "libvirt_domain" "vm" {
  for_each = local.vms
  name     = "${each.key}-vm"
  memory   = each.value.memory_mb * 1024
  vcpu     = each.value.vcpu
  os = {
    type    = "hvm"
    arch    = "x86_64"
    machine = "q35"
  }
  devices = {
    disks = [
      {
        target = {
          dev = "vda"
          bus = "virtio"
        }
        source = {
          pool   = libvirt_volume.vm_disk[each.key].pool
          volume = libvirt_volume.vm_disk[each.key].name
        }
      },
      {
        device = "cdrom"
        source = {
          pool   = libvirt_volume.cloudinit_disk[each.key].pool
          volume = libvirt_volume.cloudinit_disk[each.key].name
        }
        target = {
          dev = "sda"
          bus = "sata"
        }

      }
    ]

    interfaces = [
      {
        type  = "network"
        model = "virtio"
        source = {
          network = "default"
        }
      }
    ]

    graphics = {
      vnc = {
        autoport = "yes"
        listen   = "127.0.0.1"
      }
    }

  }
  running = true

}
