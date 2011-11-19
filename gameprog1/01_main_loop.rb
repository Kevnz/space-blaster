#!/usr/bin/env ruby
require 'rubygems'
require 'rubygame'
include Rubygame

# The main loop method.  This is called at the
# bottom of the file.  This contains the infinite
# main loop, and is exited when a QuitEvent
# is received.
def main_loop
  # Set up the objects the main loop will
  # need.

  # The screen is the window displayed on the
  # screen.
  screen = Screen.new [640, 480]

  # The event queue handles events from the
  # operating system
  queue = EventQueue.new

  # The clock limits the framerate to 30fps
  clock = Clock.new
  clock.target_framerate = 30

  # This is the infinite main loop
  loop do
    # Pause the program for a short amount of
    # time so it doesn't exceed 30fps
    clock.tick

    # Process all events, return if the window
    # was closed
    queue.each do|e|
      return if e.is_a? QuitEvent
    end

    # Fill the screen with a grey color and
    # display it on the monitor
    screen.fill [200, 200, 200]
    screen.update
  end

ensure
  Rubygame.quit
end

# If this file was the one executed from the
# command line, run the main loop.
if $0 == __FILE__
  main_loop
end
