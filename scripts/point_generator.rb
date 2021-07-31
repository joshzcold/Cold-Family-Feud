#!/usr/bin/env ruby

class Numeric
  def percent_of(n)
    n.to_f * self.to_f / 100.0
  end
end

class Generator 
  attr_accessor :number, :max_per, :max_num, :decrease, :verbose, :min_per
  def initialize(params = {})
    @number = params.fetch(:number, 5)
    @max_per = params.fetch(:max_per, 60)
    @min_per = params.fetch(:min_per, 40)
    @max_num = params.fetch(:max_num, 100)
    @decrease = params.fetch(:decrease, 66)
    @verbose = params.fetch(:verbose, false)
  end

  def dp(output)
    if verbose
      p output
    end
  end

  def run
    if min_per > max_per
      raise "minimum percentage: #{min_per} cannot be greater than maxium percentage #{max_per}"
    end
    last_per = 0
    point_arr = []
    i = 0
    begin
      dp i 
      dp "last percentage → #{last_per}%"
      if i == 0 
        new_per = rand(min_per...max_per)
      else
        new_per = decrease.percent_of(last_per)
        dp"#{new_per} = #{decrease}.percent_of(#{last_per})"
      end
      dp "percent_of #{new_per} #{max_num}"
      point_val = new_per.percent_of(max_num)
      dp "point value → #{point_val}"
      last_per = new_per
      point_arr.push(Integer(point_val))
      dp'===================='
      i += 1
    end while i < number

    return point_arr
  end
end



